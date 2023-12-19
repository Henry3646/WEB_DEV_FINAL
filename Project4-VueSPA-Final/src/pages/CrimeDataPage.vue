<!-- CrimeDataPage.vue -->
<template>
  <div class="crime-data-page">
    <h2>St. Paul Crime Data</h2>

    <table>
      <thead>
        <tr>
          <th>Case Number</th>
          <th>Date Time</th>
          <th>Incident Type</th>
          <th>Neighborhood Name</th>
          <!-- Add more columns as needed -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="crime in filteredCrimes" :key="crime.case_number">
          <td>{{ crime.case_number }}</td>
          <td>{{ crime.date_time }}</td>
          <td>{{ crime.incident_type }}</td>
          <td>{{ crime.neighborhood_name }}</td>
          <!-- Add more columns as needed -->
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      // Assuming you have a property to store retrieved crimes from the API
      crimes: [],
      selectedNeighborhoods: [], // Initialize selectedNeighborhoods
    };
  },
  computed: {
    // Filter crimes based on visible neighborhoods on the map
    filteredCrimes() {
      // Implement your filtering logic based on visible neighborhoods
      // For example, you can compare with the selected neighborhoods in the CrimeFilter component
      return this.crimes.filter((crime) =>
        this.selectedNeighborhoods.includes(crime.neighborhood_name)
      );
    },
  },
  methods: {
    // Method to update selectedNeighborhoods when emitted from CrimeFilter
    handleFilterUpdate(filters) {
      this.selectedNeighborhoods = filters.neighborhoods;
      // You may also want to trigger a new request based on other filters if needed
    },
  },
};
</script>
  
  <style scoped>
.crime-data-page {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
  