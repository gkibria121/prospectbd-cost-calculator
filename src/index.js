function getServiceList() {
    return [
      { id: 1, name: "Architectural design", rate: 100 },
      { id: 2, name: "Structural design", rate: 70 },
      { id: 3, name: "Electrical design", rate: 40 },
      { id: 4, name: "Plumbing design", rate: 25 },
      { id: 5, name: "3D design", rate: 35 },
    ];
  }
  
  function getQualityValues(qualityIndex) {
    const qualities = [
      { id: 1, quality: "High", percentage: 100 },  // 100% base cost
      { id: 2, quality: "Standard", percentage: 50 }, // 50% of the base cost
    ];
  
    return qualities.find((quality) => quality.id == qualityIndex) ?? null;
  }
  
  function getUrgencyIndex(urgencyIndex) {
    const urgencies = [
      { id: 1, urgency: "Very Urgent", percentage: 200 },    // 200% base cost
      { id: 2, urgency: "Moderately Urgent", percentage: 150 },  // 150% base cost
      { id: 3, urgency: "Normal delivery", percentage: 100 },    // 100% base cost
      { id: 4, urgency: "Economy delivery", percentage: 66 },    // 66% base cost
    ];
  
    return urgencies.find((urgency) => urgency.id == urgencyIndex) ?? null;
  }
  
  function defineProject(landArea, numberOfStory, groundCoverage) {
    return new Project(landArea, numberOfStory, groundCoverage);
  }
  
  function calculateCost(project, serviceId, qualityIndex, urgencyIndex) {
    const service = getServiceList().find((service) => service.id === serviceId);
    if (!service) {
      throw new Error("Service not found.");
    }
  
    const baseRate = service.rate;
    const baseCost = project.calculateArea() * baseRate;
  
    const quality = getQualityValues(qualityIndex);
    if (!quality) {
      throw new Error("Quality not found.");
    }
  
    const urgency = getUrgencyIndex(urgencyIndex);
    if (!urgency) {
      throw new Error("Urgency not found.");
    }
  
    const qualityPercentage = quality.percentage / 100;  // Convert to multiplier (e.g., 50% => 0.5)
    const urgencyPercentage = urgency.percentage / 100;  // Convert to multiplier (e.g., 200% => 2.0)
  
    // Calculate final cost considering quality and urgency
    const finalCost = baseCost * qualityPercentage * urgencyPercentage;
  
    return finalCost;
  }
  
  class Project {
    constructor(landArea, numberOfStory, groundCoverage) {
      this.landArea = landArea;
      this.numberOfStory = numberOfStory;
      this.groundCoverage = groundCoverage;
    }
  
    calculateArea() {
      return this.landArea * 720 * (this.numberOfStory - 1) * (this.groundCoverage / 100);
    }
  }
  
  module.exports = {
    Project,
    myLibraryFunction,
    getServiceList,
    defineProject,
    calculateCost,
    getQualityValues,
    getUrgencyIndex,
  };
  