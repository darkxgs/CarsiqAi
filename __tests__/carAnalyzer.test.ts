// هذا ملف اختبار يمكن تشغيله باستخدام Jest أو Vitest
import CarAnalyzer from "@/utils/carAnalyzer"

describe("CarAnalyzer", () => {
  describe("extractCarData", () => {
    test("يستخرج بيانات السيارة بشكل صحيح", () => {
      const message = "هيونداي النترا 2022 ماشية 130 ألف"
      const result = CarAnalyzer.extractCarData(message)

      expect(result.carBrand).toBe("hyundai")
      expect(result.carModel).toBe("elantra")
      expect(result.year).toBe(2022)
      expect(result.mileage).toBe(130000)
      expect(result.conditions).toBe("عادي")
    })

    test("يتعرف على ظروف التشغيل", () => {
      const message = "تويوتا كامري 2020 ماشية 80 ألف استخدام شاق"
      const result = CarAnalyzer.extractCarData(message)

      expect(result.carBrand).toBe("toyota")
      expect(result.carModel).toBe("camry")
      expect(result.conditions).toBe("شاق")
    })
  })

  describe("validateCarData", () => {
    test("يتحقق من اكتمال البيانات", () => {
      const completeData = {
        carBrand: "hyundai",
        carModel: "elantra",
        year: 2022,
        mileage: 130000,
        conditions: "عادي",
      }

      const incompleteData = {
        carBrand: "hyundai",
        carModel: "",
        year: 2022,
        mileage: 130000,
        conditions: "عادي",
      }

      expect(CarAnalyzer.validateCarData(completeData)).toBeNull()
      expect(CarAnalyzer.validateCarData(incompleteData)).toContain("لم أتمكن من تحديد موديل السيارة")
    })
  })

  describe("determineYearCategory", () => {
    test("يحدد فئة السنة بشكل صحيح", () => {
      const carData = {
        carBrand: "hyundai",
        carModel: "elantra",
        year: 2022,
        mileage: 130000,
        conditions: "عادي",
      }

      expect(CarAnalyzer.determineYearCategory(carData)).toBe("2020-2024")
    })
  })

  describe("analyzeCarAndRecommendOil", () => {
    test("يقدم توصية صحيحة لسيارة معروفة", () => {
      const message = "هيونداي النترا 2022 ماشية 130 ألف"
      const result = CarAnalyzer.analyzeCarAndRecommendOil(message)

      expect("errorMessage" in result).toBe(false)
      if (!("errorMessage" in result)) {
        expect(result.carSpecs).not.toBeNull()
        expect(result.primaryOil).not.toBeNull()
        expect(result.recommendedViscosity).toBe("5W-30")
      }
    })

    test("يتعامل مع سيارة غير معروفة", () => {
      const message = "سيارة غير موجودة 2022"
      const result = CarAnalyzer.analyzeCarAndRecommendOil(message)

      expect("errorMessage" in result).toBe(true)
    })
  })
})
