<template>
  <div class="home">
    <div>
      <h2>New Incident</h2>
      <form @submit.prevent="submitIncident">
        <label for="caseNumber">Case Number:</label>
        <input v-model="newIncident.caseNumber" required />

        <label for="dateTime">Date and Time:</label>
        <input type="datetime-local" v-model="newIncident.dateTime" required />

        <label for="code">Incident Code:</label>
        <input v-model="newIncident.code" required />

        <label for="incident">Incident:</label>
        <input v-model="newIncident.incident" required />

        <label for="policeGrid">Police Grid:</label>
        <input v-model="newIncident.policeGrid" required />

        <label for="neighborhoodNumber">Neighborhood Number:</label>
        <input v-model="newIncident.neighborhoodNumber" required />

        <label for="block">Block:</label>
        <input v-model="newIncident.block" required />

        <button type="submit">Submit</button>
      </form>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>

    <div id="map">
      <!-- Your map code goes here -->
    </div>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      newIncident: {
        caseNumber: "",
        dateTime: "",
        code: "",
        incident: "",
        policeGrid: "",
        neighborhoodNumber: "",
        block: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    async submitIncident() {
      // Validate if all fields are filled out
      if (this.validateForm()) {
        // Make PUT request to add new incident
        try {
          const response = await fetch("/new-incident", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.newIncident),
          });

          if (response.ok) {
            // Reset form after successful submission
            this.resetForm();
            alert("Incident added successfully!");
          } else {
            console.error("Failed to add incident:", response.statusText);
            this.errorMessage = "Failed to add incident. Please try again.";
          }
        } catch (error) {
          console.error("Error adding incident:", error);
          this.errorMessage = "An unexpected error occurred. Please try again.";
        }
      } else {
        this.errorMessage = "Please fill out all fields before submitting.";
      }
    },
    validateForm() {
      // Validate if all fields are filled out
      return Object.values(this.newIncident).every(
        (value) => value.trim() !== ""
      );
    },
    resetForm() {
      // Reset form fields and error message
      this.newIncident = {
        caseNumber: "",
        dateTime: "",
        code: "",
        incident: "",
        policeGrid: "",
        neighborhoodNumber: "",
        block: "",
      };
      this.errorMessage = "";
    },
  },
};
</script>
  
  <style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
  