"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { extractOilRecommendationData, suggestOil } from "@/utils/carQueryApi";

export default function TestCarAPIPage() {
  const [query, setQuery] = useState<string>("");
  const [queryType, setQueryType] = useState<string>("trim");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedTrim, setSelectedTrim] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{query: string, type: string, result: any}>>([]);

  // Generate years for dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());

  const fetchCarData = async () => {
    if (!query.trim()) {
      setError("Please enter a car query");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedTrim(null);

    try {
      const response = await fetch("/api/car", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          type: queryType,
          ...(selectedYear && selectedYear !== "auto-detect" ? { year: selectedYear } : {})
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch car data");
      }

      setResult(data);
      
      // Add to history
      setHistory(prev => [
        { query: query.trim(), type: queryType, result: data },
        ...prev.slice(0, 9) // Keep only last 10 queries
      ]);
      
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching car data");
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return <Badge className="bg-green-500">High</Badge>;
    if (confidence >= 50) return <Badge className="bg-yellow-500">Medium</Badge>;
    return <Badge className="bg-red-500">Low</Badge>;
  };

  const renderTrimDetails = (trim: any) => {
    if (!trim) return null;
    
    // Extract important specs for oil recommendation
    const specs = extractOilRecommendationData(trim);
    const oilRecommendation = suggestOil(specs);
    
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            {trim.model_make_display} {trim.model_display || trim.model_name} {trim.model_trim}
          </CardTitle>
          <CardDescription>
            {trim.model_year} - Engine: {trim.model_engine_cc}cc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Engine Specifications</h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li><span className="font-medium">Fuel Type:</span> {trim.model_engine_fuel || "N/A"}</li>
                <li><span className="font-medium">Engine Power:</span> {trim.model_engine_power_ps || "N/A"} PS</li>
                <li><span className="font-medium">Torque:</span> {trim.model_engine_torque_nm || "N/A"} Nm</li>
                <li><span className="font-medium">Position:</span> {trim.model_engine_position || "N/A"}</li>
                <li><span className="font-medium">Type:</span> {trim.model_engine_type || "N/A"}</li>
                <li><span className="font-medium">Compression:</span> {trim.model_engine_compression || "N/A"}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium">Other Specifications</h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li><span className="font-medium">Transmission:</span> {trim.model_transmission_type || "N/A"}</li>
                <li><span className="font-medium">Fuel Capacity:</span> {trim.model_fuel_cap_l || "N/A"} L</li>
                <li><span className="font-medium">Weight:</span> {trim.model_weight_kg || "N/A"} kg</li>
                <li><span className="font-medium">City Fuel Economy:</span> {trim.model_lkm_city || "N/A"} L/km</li>
                <li><span className="font-medium">Drive System:</span> {trim.model_drive || "N/A"}</li>
              </ul>
            </div>
          </div>
          
          {/* Oil recommendation section */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-medium text-base mb-2">🛢️ Oil Recommendation</h3>
            <Alert className="bg-blue-50">
              <div className="flex flex-col gap-1">
                <div className="flex items-center">
                  <Badge className="mr-2 bg-green-600">Viscosity</Badge>
                  <span className="font-semibold">{oilRecommendation.viscosity}</span>
                </div>
                <div className="flex items-center">
                  <Badge className="mr-2 bg-purple-600">Type</Badge>
                  <span className="font-semibold">{oilRecommendation.quality}</span>
                </div>
                <AlertDescription className="mt-2 italic text-sm">
                  {oilRecommendation.reason}
                </AlertDescription>
              </div>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Car API Test Tool</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Query Car Information</CardTitle>
          <CardDescription>
            Enter car details in any format (Arabic or English) to look up specifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="query" className="text-sm font-medium">Car Query</label>
            <Input
              id="query"
              placeholder="e.g. تويوتا كامري 2020 or Honda Civic 2019"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="queryType" className="text-sm font-medium">Query Type</label>
              <Select 
                value={queryType}
                onValueChange={setQueryType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trim">Trims & Specifications</SelectItem>
                  <SelectItem value="make">Make Info</SelectItem>
                  <SelectItem value="model">Available Models</SelectItem>
                  <SelectItem value="all">All Information</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="year" className="text-sm font-medium">Year (Optional)</label>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto-detect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto-detect">Auto-detect</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={fetchCarData} disabled={loading}>
            {loading ? "Loading..." : "Lookup Car Data"}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Tabs defaultValue="result" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="result">Results</TabsTrigger>
            <TabsTrigger value="json">Raw JSON</TabsTrigger>
            <TabsTrigger value="history">Query History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="result" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Query Results</CardTitle>
                <div className="flex items-center space-x-2">
                  <CardDescription>
                    Confidence:
                  </CardDescription>
                  {result.confidence && getConfidenceBadge(result.confidence)}
                </div>
              </CardHeader>
              <CardContent>
                {/* Display car image if available */}
                {result.imageUrl && (
                  <div className="flex justify-center mb-6">
                    <div className="relative h-48 w-full max-w-md">
                      <img 
                        src={result.imageUrl} 
                        alt={`${result.make} ${result.model} ${result.year || ''}`}
                        className="object-contain h-full w-full"
                        onError={(e) => {
                          // Replace broken image with placeholder
                          e.currentTarget.src = "https://img.freepik.com/free-vector/car-icon-side-view_23-2147501694.jpg";
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Get image button if no image but we have make & model */}
                {!result.imageUrl && result.make && result.model && (
                  <div className="flex justify-center mb-6">
                    <Button 
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const response = await fetch("/api/car", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              query: `${result.make} ${result.model} ${result.year || ''}`,
                              type: "image",
                            }),
                          });
                          
                          if (!response.ok) throw new Error("Failed to fetch image");
                          
                          const data = await response.json();
                          setResult({...result, imageUrl: data.imageUrl});
                        } catch (err) {
                          console.error("Error fetching car image:", err);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Load Car Image"}
                    </Button>
                  </div>
                )}
                
                {result.make && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Make: {result.make}</h3>
                  </div>
                )}
                
                {result.model && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Model: {result.model}</h3>
                  </div>
                )}
                
                {result.year && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Year: {result.year}</h3>
                  </div>
                )}

                {result.makes && Array.isArray(result.makes) && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Available Makes ({result.makes.length}):</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.makes.map((make: string, i: number) => (
                        <Badge key={i} variant="outline">{make}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {result.models && Array.isArray(result.models) && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Available Models ({result.models.length}):</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.models.map((model: string, i: number) => (
                        <Badge key={i} variant="outline">{model}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {result.trims && Array.isArray(result.trims) && result.trims.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Available Trims ({result.trims.length}):</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {result.trims.map((trim: any, i: number) => (
                        <Button 
                          key={i} 
                          variant={selectedTrim === trim.model_id ? "default" : "outline"}
                          className="justify-start text-left"
                          onClick={() => setSelectedTrim(trim.model_id === selectedTrim ? null : trim.model_id)}
                        >
                          {trim.model_trim || "Standard"} - {trim.model_engine_cc}cc
                        </Button>
                      ))}
                    </div>

                    {selectedTrim && renderTrimDetails(
                      result.trims.find((trim: any) => trim.model_id === selectedTrim)
                    )}
                  </div>
                )}

                                {result.trims && Array.isArray(result.trims) && result.trims.length === 0 && 
                  result.suggestedModels && Array.isArray(result.suggestedModels) && (
                  <div className="mb-4">
                    <Alert variant="default">
                      <AlertTitle>No trims found for this exact query</AlertTitle>
                      <AlertDescription>
                        Try one of these models instead:
                        <div className="flex flex-wrap gap-2 mt-2">
                          {result.suggestedModels.map((model: string, i: number) => (
                            <Badge key={i} className="cursor-pointer"
                              onClick={() => setQuery(`${result.make} ${model} ${result.year || ''}`)}
                            >
                              {model}
                            </Badge>
                          ))}
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="json">
            <Card>
              <CardHeader>
                <CardTitle>Raw JSON Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Query History</CardTitle>
                <CardDescription>Recent car queries</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-sm text-gray-500">No previous queries</p>
                ) : (
                  <div className="space-y-4">
                    {Array.isArray(history) && history.map((item, i) => (
                      <div 
                        key={i} 
                        className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          setQuery(item.query);
                          setQueryType(item.type);
                          setResult(item.result);
                        }}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{item.query}</span>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {item.result?.make || ''} {item.result?.model || ''} {item.result?.year || ''}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 