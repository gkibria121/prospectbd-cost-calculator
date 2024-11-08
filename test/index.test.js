const { 
  getServiceList,
  defineProject,
  calculateCost,
  getQualityValues,
  getUrgencyIndex,
  defineBuilding, 
  buildArea,
  getBuildingCost
} = require('../src/index.js');

describe("Service Cost Calculation", () => {

  // Test for getting the service list
  test("should return a list of services", async () => {
    const services = await getServiceList();
    expect(services).toBeInstanceOf(Array);
    expect(services.length).toBeGreaterThan(0);
    expect(services[0]).toHaveProperty("name");
    expect(services[0]).toHaveProperty("rate");
  });

  // Test for getting quality values
  test("should return quality value by index", async () => {
    const quality = await getQualityValues(1); // High Quality
    expect(quality).toEqual({ id: 1, quality: "High", percentage: 100 });

    const qualityStandard = await getQualityValues(2); // Standard Quality
    expect(qualityStandard).toEqual({ id: 2, quality: "Standard", percentage: 50 });

    const nonExistentQuality = await getQualityValues(999);
    expect(nonExistentQuality).toBeNull(); // Non-existent quality
  });

  // Test for getting urgency index
  test("should return urgency value by index", async () => {
    const urgency = await getUrgencyIndex(1); // Very Urgent
    expect(urgency).toEqual({ id: 1, urgency: "Very Urgent", percentage: 200 });

    const normalUrgency = await getUrgencyIndex(3); // Normal delivery
    expect(normalUrgency).toEqual({ id: 3, urgency: "Normal delivery", percentage: 100 });

    const nonExistentUrgency = await getUrgencyIndex(999);
    expect(nonExistentUrgency).toBeNull(); // Non-existent urgency
  });

  // Test for calculating project area
  test("should correctly calculate the area of the project", () => {
    const project = defineProject(500, 2, 50); // landArea, numberOfStory, groundCoverage
    const area = project.calculateArea();
    expect(area).toBeCloseTo(180000); // (500 * 720 * 1 * (50 / 100))
  });

  // Test for calculating the cost based on quality and urgency
  test("should correctly calculate cost based on quality and urgency", async () => {
    const project = defineProject(500, 2, 50); // landArea, numberOfStory, groundCoverage
    const serviceId = 1; // Architectural design with a rate of 100
    const qualityIndex = 2; // Standard Quality (50%)
    const urgencyIndex = 1; // Very Urgent (200%)

    const cost = await calculateCost(project, serviceId, qualityIndex, urgencyIndex);
    expect(cost).toBeCloseTo(18000000); // 180000 (base area * rate) * 0.5 * 2.0
  });

  // Test for invalid service ID
  test("should throw an error for invalid service ID", async () => {
    const project = defineProject(500, 2, 50);
    await expect(calculateCost(project, 999, 1, 1)).rejects.toThrow("Service not found.");
  });

  // Test for invalid quality index
  test("should throw an error for invalid quality index", async () => {
    const project = defineProject(500, 2, 50);
    const serviceId = 1; // Valid service ID
    await expect(calculateCost(project, serviceId, 999, 1)).rejects.toThrow("Quality not found.");
  });

  // Test for invalid urgency index
  test("should throw an error for invalid urgency index", async () => {
    const project = defineProject(500, 2, 50);
    const serviceId = 1; // Valid service ID
    await expect(calculateCost(project, serviceId, 1, 999)).rejects.toThrow("Urgency not found.");
  });

});


describe("Building Calculations", () => {
  
  // Test the Building class constructor
  test("should correctly instantiate a Building object", () => {
    const building = defineBuilding(500, 50, 3);
    expect(building.landArea).toBe(500);
    expect(building.percentCovered).toBe(50);
    expect(building.numberOfStories).toBe(3);
  });
  
  // Test the buildArea function
  test("should correctly calculate the build area of the building", () => {
    const building = defineBuilding(500, 50, 3); // landArea, percentCovered, numberOfStories
    const area = buildArea(building);
    expect(area).toBeCloseTo(540000); // 500 * 720 * (50 / 100) * 3
  });
  
  // Test the getBuildingCost function
  test("should correctly calculate the building cost based on quality factor", () => {
    const building = defineBuilding(500, 50, 3); // landArea, percentCovered, numberOfStories
    const qualityFactor = 1.5;
    const cost = getBuildingCost(building, qualityFactor);
    expect(cost).toBeCloseTo(1620000000); // 540000 (area) * 1.5 * 2000
  });

  // Test for edge case: zero stories
  test("should return zero area and cost for a building with zero stories", () => {
    const building = defineBuilding(500, 50, 0); // Zero stories
    const area = buildArea(building);
    const qualityFactor = 1.5;
    const cost = getBuildingCost(building, qualityFactor);

    expect(area).toBe(0);
    expect(cost).toBe(0);
  });

  // Test for edge case: zero percent coverage
  test("should return zero area and cost for a building with zero percent coverage", () => {
    const building = defineBuilding(500, 0, 3); // Zero percent covered
    const area = buildArea(building);
    const qualityFactor = 1.5;
    const cost = getBuildingCost(building, qualityFactor);

    expect(area).toBe(0);
    expect(cost).toBe(0);
  });

});