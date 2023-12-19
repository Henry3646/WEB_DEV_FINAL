<!-- CrimeDataPage.vue -->
<template>
  <div class="crime-data-page">
    <h2>St. Paul Crime Data</h2>

    <!-- Legend for the colors -->
    <div class="legend">
      <span class="violent-crime"></span> Violent Crimes
      <span class="property-crime"></span> Property Crimes
      <span class="other-crime"></span> Other Crimes
    </div>

    <table>
      <thead>
        <tr>
          <th>Case Number</th>
          <th>Date Time</th>
          <th>Incident Type</th>
          <th>Neighborhood Name</th>
          <th>Crime Address</th>
          <th>Actions</th>
          <!-- Added a column for 'Actions' -->
          <!-- Add more columns as needed -->
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="crime in filteredCrimes"
          :key="crime.case_number"
          :class="crimeCategoryClass(crime)"
        >
          <td>{{ crime.case_number }}</td>
          <td>{{ crime.date_time }}</td>
          <td>{{ crime.incident_type }}</td>
          <td>{{ crime.neighborhood_name }}</td>
          <td>{{ formatAddress(crime.address) }}</td>
          <td>
            <!-- 'Delete' button -->
            <button @click="deleteCrime(crime.case_number)">Delete</button>
          </td>
          <!-- Add more columns as needed -->
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  <script>
export default {
  // ... existing component options ...

  methods: {
    // ... existing methods ...

    // Method to delete a crime
    async deleteCrime(caseNumber) {
      try {
        // Send a DELETE request to remove the incident from the database
        await this.$axios.delete(`/remove-incident/${caseNumber}`);
        // Assuming you have a method to refresh the crime data after deletion
        this.refreshCrimeData();
      } catch (error) {
        console.error("Error deleting crime:", error);
        // Handle the error, e.g., show a notification to the user
      }
    },
    formatAddress(address) {
      // Check if the address contains 'X' in the address number
      const regex = /^(\d+)X\s(.*)/;
      const match = address.match(regex);

      // If 'X' is found in the address number, replace it with '0'
      if (match) {
        const modifiedAddress = match[1] + "0 " + match[2];
        return modifiedAddress;
      }

      // If 'X' is not found, return the original address
      return address;
    },
    crimeCategoryClass(crime) {
      const incidentType = crime.incident_type.toLowerCase();

      if (
        incidentType.includes("assault") ||
        incidentType.includes("robbery") ||
        incidentType.includes("homicide")
      ) {
        return "violent-crime";
      } else if (
        incidentType.includes("burglary") ||
        incidentType.includes("theft") ||
        incidentType.includes("vandalism")
      ) {
        return "property-crime";
      } else {
        return "other-crime";
      }
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

/* Styles for categorizing crimes */
.violent-crime {
  background-color: #ffcccc; /* Light red */
}

.property-crime {
  background-color: #ccffcc; /* Light green */
}

.other-crime {
  background-color: #ccccff; /* Light blue */
}

/* Legend styles */
.legend {
  margin-top: 10px;
}

.legend span {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 5px;
}

.violent-crime {
  background-color: #ffcccc;
}

.property-crime {
  background-color: #ccffcc;
}

.other-crime {
  background-color: #ccccff;
}
</style>
  