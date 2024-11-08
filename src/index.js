const fs = require('fs').promises;

async function loadJson(fileName) {
  const data = await fs.readFile(fileName, 'utf8');
  return JSON.parse(data);
} 

async function getServiceList() {
  return await loadJson('src/db/services.json');
} 

async function getQualityValues(qualityIndex) {
  const qualities = await loadJson('src/db/qualities.json');
  return qualities.find((quality) => quality.id == qualityIndex) ?? null;
}

async function getQualityFactor(qualityIndex) {
  const qualityFactors = await loadJson('src/db/qualityFactors.json');
  return qualityFactors.find((quality) => quality.id == qualityIndex) ?? null;
}


async function getUrgencyIndex(urgencyIndex) {
  const urgencies = await loadJson('src/db/urgencies.json');
  return urgencies.find((urgency) => urgency.id == urgencyIndex) ?? null;
}

function defineProject(landArea, numberOfStory, groundCoverage) {
  return new Project(landArea, numberOfStory, groundCoverage);
}

async function calculateCost(project, serviceId, qualityIndex, urgencyIndex) {
  const services = await getServiceList();
  const service = services.find((service) => service.id === serviceId);
  if (!service) {
    throw new Error("Service not found.");
  }

  const baseRate = service.rate;
  const baseCost = project.calculateArea() * baseRate;

  const quality = await getQualityValues(qualityIndex);
  if (!quality) {
    throw new Error("Quality not found.");
  }

  const urgency = await getUrgencyIndex(urgencyIndex);
  if (!urgency) {
    throw new Error("Urgency not found.");
  }

  const qualityPercentage = quality.percentage / 100;
  const urgencyPercentage = urgency.percentage / 100;

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


function buildArea(
building
) {
  return building.landArea * 720 * (building.percentCovered / 100) * building.numberOfStories;
}


function getBuildingCost( 
  building,
  qualityFactor
) {
   return buildArea(building) * qualityFactor * 2000;
}


class Building {

  constructor(landArea,
    percentCovered,
    numberOfStories) {
    this.landArea = landArea
    this.percentCovered = percentCovered
    this.numberOfStories =numberOfStories
  }
}

function defineBuilding(landArea, percentCovered, numberOfStories) {
  return new Building(landArea, percentCovered, numberOfStories);
}


module.exports = { 
  defineBuilding, 
  getServiceList,
  defineProject,
  calculateCost,
  getQualityValues,
  getUrgencyIndex,
  getBuildingCost,
  getQualityFactor,
  buildArea
};
