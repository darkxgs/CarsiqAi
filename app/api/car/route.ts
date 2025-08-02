import { NextResponse } from 'next/server';
import { normalizeArabicCarInput, getCarModels, getAvailableMakes, getAvailableModels, getCarImageUrl } from '@/utils/carQueryApi';
import logger from '@/utils/logger';
import { z } from 'zod';

// Input validation schema
const CarQuerySchema = z.object({
  query: z.string().min(2, "Query must be at least 2 characters"),
  type: z.enum(['make', 'model', 'trim', 'all', 'image']).optional().default('trim'),
  year: z.string().optional()
});

/**
 * Car data lookup API endpoint
 * 
 * This endpoint helps extract and normalize car make, model, and year
 * from a free-format text query, especially useful for Arabic inputs.
 * It also provides detailed car specifications from the CarQuery API.
 */
export async function POST(req: Request) {
  try {
    // Parse request body
    let body: any;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Validate request format
    const validationResult = CarQuerySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request format', details: validationResult.error.issues },
        { status: 400 }
      );
    }
    
    const { query, type, year: requestedYear } = validationResult.data;

    logger.info('Processing car data query', { query, type, requestedYear });

    // Step 1: Normalize the input (convert Arabic text to standardized car data)
    const normalizedCarData = await normalizeArabicCarInput(query);
    
    // Step 2: Query the car API based on the normalized data and request type
    let result: any = { normalized: normalizedCarData };
    
    try {
      // Use either the explicitly requested year or the one detected from the query
      const yearToUse = requestedYear || normalizedCarData.year;
      
      if (type === 'make') {
        // If just requesting make info
        if (normalizedCarData.make) {
          result = {
            make: normalizedCarData.make,
            confidence: normalizedCarData.confidence,
            query
          };
        } else {
          // List available makes for the requested year
          const makes = await getAvailableMakes(yearToUse || undefined);
          result = {
            makes,
            count: makes.length,
            year: yearToUse,
            query
          };
        }
      } else if (type === 'model') {
        // If no make was detected in the query
        if (!normalizedCarData.make) {
          return NextResponse.json(
            { 
              error: 'Could not extract car make from query',
              query,
              confidence: normalizedCarData.confidence
            },
            { status: 400 }
          );
        }
        
        // Get available models for this make and year
        const models = await getAvailableModels(
          normalizedCarData.make, 
          yearToUse || undefined
        );
        
        result = {
          make: normalizedCarData.make,
          models,
          count: models.length,
          year: yearToUse,
          query,
          confidence: normalizedCarData.confidence
        };
      } else if (type === 'all') {
        // Comprehensive information request
        
        // Get all makes if available
        const makes = await getAvailableMakes(yearToUse || undefined);
        
        // Start building the result
        result = {
          query,
          normalized: normalizedCarData,
          makes: {
            count: makes.length,
            list: makes
          }
        };
        
        // If we have a make, get models
        if (normalizedCarData.make) {
          const models = await getAvailableModels(
            normalizedCarData.make, 
            yearToUse || undefined
          );
          
          result.models = {
            count: models.length,
            list: models
          };
          
          // If we also have a model, get trims
          if (normalizedCarData.model) {
            const trims = await getCarModels(
              normalizedCarData.make,
              normalizedCarData.model,
              yearToUse
            );
            
            result.trims = {
              count: trims.length,
              list: trims
            };
          }
        }
      } else if (type === 'image') {
        // If we don't have both make and model, return an error
        if (!normalizedCarData.make || !normalizedCarData.model) {
          return NextResponse.json(
            { 
              error: 'Could not extract complete car information for image',
              make: normalizedCarData.make || null,
              model: normalizedCarData.model || null,
              year: yearToUse,
              confidence: normalizedCarData.confidence,
              query
            },
            { status: 400 }
          );
        }
        
        // Get car image URL
        const imageUrl = await getCarImageUrl(
          normalizedCarData.make,
          normalizedCarData.model,
          yearToUse
        );
        
        result = {
          make: normalizedCarData.make,
          model: normalizedCarData.model,
          year: yearToUse,
          imageUrl,
          query,
          confidence: normalizedCarData.confidence
        };
      } else {
        // Default case - get detailed car trims
        
        // If we don't have both make and model, return with an error
        if (!normalizedCarData.make || !normalizedCarData.model) {
          return NextResponse.json(
            { 
              error: 'Could not extract complete car information from query',
              make: normalizedCarData.make || null,
              model: normalizedCarData.model || null,
              year: yearToUse,
              confidence: normalizedCarData.confidence,
              query
            },
            { status: 400 }
          );
        }
        
        const carTrims = await getCarModels(
          normalizedCarData.make,
          normalizedCarData.model,
          yearToUse
        );
        
        // No trims found - this might mean the combination is invalid
        if (carTrims.length === 0) {
          // Try getting available models to suggest alternatives
          const availableModels = await getAvailableModels(
            normalizedCarData.make, 
            yearToUse || undefined
          );
          
          result = {
            make: normalizedCarData.make,
            model: normalizedCarData.model,
            year: yearToUse,
            trims: [],
            suggestedModels: availableModels,
            count: 0,
            query,
            confidence: normalizedCarData.confidence,
            message: "No trims found for this car. Check the model name or try suggested models."
          };
        } else {
          result = {
            make: normalizedCarData.make,
            model: normalizedCarData.model,
            year: yearToUse,
            trims: carTrims,
            count: carTrims.length,
            query,
            confidence: normalizedCarData.confidence
          };
        }
      }
    } catch (error: any) {
      logger.error('Error fetching car data from CarQuery API', { 
        error: error.message || error, 
        normalizedCarData 
      });
      
      return NextResponse.json(
        { 
          error: 'Error fetching car data',
          message: error.message || 'Unknown error',
          normalizedQuery: normalizedCarData,
          query
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    logger.error('Unhandled error in car API', { error: error.message || error });
    
    return NextResponse.json(
      { error: 'An unexpected error occurred', message: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
} 