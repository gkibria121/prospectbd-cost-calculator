const {
    Project,
    getServiceList,
    defineProject,
    calculateCost,
    getQualityValues,
    getUrgencyIndex
  } = require('../src/index.js');
  
  describe("Service Cost Calculation", () => {
  
    // Test for getting the service list
    test("should return a list of services", () => {
      const services = getServiceList();
      expect(services).toBeInstanceOf(Array);
      expect(services.length).toBeGreaterThan(0);
      expect(services[0]).toHaveProperty("name");
      expect(services[0]).toHaveProperty("rate");
    });
  
    // Test for getting quality values
    test("should return quality value by index", () => {
      const quality = getQualityValues(1); // High Quality
      expect(quality).toEqual({ id: 1, quality: "High", percentage: 100 });
  
      const qualityStandard = getQualityValues(2); // Standard Quality
      expect(qualityStandard).toEqual({ id: 2, quality: "Standard", percentage: 50 });
  
      const nonExistentQuality = getQualityValues(999);
      expect(nonExistentQuality).toBeNull(); // Non-existent quality
    });
  
    // Test for getting urgency index
    test("should return urgency value by index", () => {
      const urgency = getUrgencyIndex(1); // Very Urgent
      expect(urgency).toEqual({ id: 1, urgency: "Very Urgent", percentage: 200 });
  
      const normalUrgency = getUrgencyIndex(3); // Normal delivery
      expect(normalUrgency).toEqual({ id: 3, urgency: "Normal delivery", percentage: 100 });
  
      const nonExistentUrgency = getUrgencyIndex(999);
      expect(nonExistentUrgency).toBeNull(); // Non-existent urgency
    });
  
    // Test for calculating project area
    test("should correctly calculate the area of the project", () => {
      const project = defineProject(500, 2, 50); // landArea, numberOfStory, groundCoverage
      const area = project.calculateArea();
      expect(area).toBeCloseTo(180000); // (500 * 720 * 1 * (50 / 100))
    });
  
    // Test for calculating the cost based on quality and urgency
    test("should correctly calculate cost based on quality and urgency", () => {
      const project = defineProject(500, 2, 50); // landArea, numberOfStory, groundCoverage
      const serviceId = 1; // Architectural design with a rate of 100
      const qualityIndex = 2; // Standard Quality (50%)
      const urgencyIndex = 1; // Very Urgent (200%)
  
      const cost = calculateCost(project, serviceId, qualityIndex, urgencyIndex);
      expect(cost).toBeCloseTo(18000000); // 180000 (base area * rate) * 0.5 * 2.0
    });
  
    // Test for invalid service ID
    test("should throw an error for invalid service ID", () => {
      const project = defineProject(500, 2, 50);
      expect(() => calculateCost(project, 999, 1, 1)).toThrow("Service not found.");
    });
  
    // Test for invalid quality index
    test("should throw an error for invalid quality index", () => {
      const project = defineProject(500, 2, 50);
      const serviceId = 1; // Valid service ID
      expect(() => calculateCost(project, serviceId, 999, 1)).toThrow("Quality not found.");
    });
  
    // Test for invalid urgency index
    test("should throw an error for invalid urgency index", () => {
      const project = defineProject(500, 2, 50);
      const serviceId = 1; // Valid service ID
      expect(() => calculateCost(project, serviceId, 1, 999)).toThrow("Urgency not found.");
    });
  
  });
  