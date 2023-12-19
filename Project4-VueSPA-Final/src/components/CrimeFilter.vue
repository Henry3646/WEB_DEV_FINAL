<!-- CrimeFilter.vue -->
<template>
  <div class="crime-filter">
    <h2>Crime Filters</h2>

    <!-- Incident Type Filter -->
    <section>
      <h3>Incident Type</h3>
      <div v-for="incidentType in incidentTypes" :key="incidentType.code">
        <input
          type="checkbox"
          :id="incidentType.code"
          :value="incidentType.code"
          v-model="selectedIncidentTypes"
          @change="updateFilters"
        />
        <label :for="incidentType.code">{{ incidentType.incident_type }}</label>
      </div>
    </section>

    <!-- Neighborhood Name Filter -->
    <section>
      <h3>Neighborhood Name</h3>
      <div v-for="neighborhood in neighborhoods" :key="neighborhood.name">
        <input
          type="checkbox"
          :id="neighborhood.name"
          :value="neighborhood.name"
          v-model="selectedNeighborhoods"
          @change="updateFilters"
        />
        <label :for="neighborhood.name">{{ neighborhood.name }}</label>
      </div>
    </section>

    <!-- Date Range Filter -->
    <section>
      <h3>Date Range</h3>
      <label for="startDate">Start Date:</label>
      <input
        type="date"
        id="startDate"
        v-model="startDate"
        @change="updateFilters"
      />

      <label for="endDate">End Date:</label>
      <input
        type="date"
        id="endDate"
        v-model="endDate"
        @change="updateFilters"
      />
    </section>

    <!-- Max Incidents Filter -->
    <section>
      <h3>Max Incidents</h3>
      <label for="maxIncidents">Max Incidents:</label>
      <input
        type="number"
        id="maxIncidents"
        v-model.number="maxIncidents"
        @change="updateFilters"
      />
    </section>

    <!-- Update Button -->
    <button @click="updateFilters">Update</button>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      incidentTypes: [
        { code: 1800, incident_type: "Narcotics" },
        // Add more incident types as needed
      ],
      neighborhoods: [
        { name: "Neighborhood A" },
        // Add more neighborhoods as needed
      ],
      selectedIncidentTypes: [],
      selectedNeighborhoods: [],
      startDate: "",
      endDate: "",
      maxIncidents: null,
    };
  },
  methods: {
    updateFilters() {
      // Trigger a new request to the St. Paul Crime API with the updated filters
      const filters = {
        incident_types: this.selectedIncidentTypes,
        neighborhoods: this.selectedNeighborhoods,
        start_date: this.startDate,
        end_date: this.endDate,
        max_incidents: this.maxIncidents,
      };

      this.$emit("update-filters", filters);
    },
  },
};
</script>
  
  <style scoped>
.crime-filter {
  padding: 20px;
}

.crime-filter section {
  margin-bottom: 20px;
}

.crime-filter label {
  margin-right: 10px;
}
</style>
  