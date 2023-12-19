<template>
  <div class="home">
    <div>
      <label for="locationInput">Enter Location:</label>
      <input id="locationInput" v-model="locationInput" />
      <button @click="goToLocation">Go</button>
    </div>
    <div>
      <CrimeFilter @update-filters="handleFilterUpdate" />
    </div>
    <div id="map">
      <LMap
        :zoom="mapOptions.zoom"
        :center="mapOptions.center"
        :bounds="mapBounds"
        @moveend="updateLocation"
      >
        <LTileLayer :url="tileLayerUrl"></LTileLayer>
        <LMarker :lat-lng="markerCoords"></LMarker>
        <LMarker
          v-for="neighborhood in neighborhoods"
          :key="neighborhood.name"
          :lat-lng="neighborhood.coordinates"
        >
          <LPopup
            >{{ neighborhood.name }}<br />Crimes:
            {{ neighborhood.crimeCount }}</LPopup
          >
        </LMarker>
      </LMap>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import CrimeFilter from "../components/CrimeFilter"; // Adjust the path based on your project structure

export default {
  name: "MapView",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    CrimeFilter,
  },
  data() {
    return {
      mapOptions: {
        zoom: 13,
        center: [44.9537, -93.09], // St. Paul coordinates
      },
      tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      markerCoords: [44.9537, -93.09], // Marker initial coordinates
      locationInput: "",
      mapBounds: [
        [44.858, -93.208],
        [45.027, -93.005],
      ], // St. Paul bounds
      minZoom: 11,
      maxZoom: 18,
      neighborhoods: [], // Array to store neighborhood data
    };
  },
  mounted() {
    this.initializeMap();
    this.fetchNeighborhoodData();
  },
  methods: {
    initializeMap() {
      this.map = L.map("map", this.mapOptions);
      L.tileLayer(this.tileLayerUrl).addTo(this.map);
      L.marker(this.markerCoords).addTo(this.map);

      // Enable pan and zoom with mouse click-and-drag and scroll wheel
      this.map.scrollWheelZoom.enable();
      this.map.dragging.enable();

      // Set up event listener for moveend event
      this.map.on("moveend", this.updateLocation);

      // Set bounds for the map
      this.map.setMaxBounds(this.mapBounds);
      this.map.on("drag", () => {
        this.map.panInsideBounds(this.mapBounds, { animate: false });
      });

      // Set zoom constraints
      this.map.setMinZoom(this.minZoom);
      this.map.setMaxZoom(this.maxZoom);
    },
    async fetchNeighborhoodData() {
      try {
        // Replace with your actual API endpoint or logic to get neighborhood data
        const response = await fetch("https://example.com/api/neighborhoods");
        const neighborhoodData = await response.json();

        // Assuming the API response provides an array of neighborhoods with coordinates and crime count
        this.neighborhoods = neighborhoodData.map((neighborhood) => ({
          name: neighborhood.name,
          coordinates: [neighborhood.lat, neighborhood.lng],
          crimeCount: neighborhood.crimeCount,
        }));

        // Add markers for each neighborhood
        this.neighborhoods.forEach((neighborhood) => {
          L.marker(neighborhood.coordinates)
            .addTo(this.map)
            .bindPopup(
              `${neighborhood.name}<br>Crimes: ${neighborhood.crimeCount}`
            );
        });
      } catch (error) {
        console.error("Error fetching neighborhood data:", error);
      }
    },
    async goToLocation() {
      // Use Nominatim API to convert address to coordinates
      const coordinates = await this.getCoordinatesFromAddress(
        this.locationInput
      );

      if (coordinates) {
        // Clamp the coordinates within St. Paul's bounding box
        const clampedCoordinates = this.clampCoordinates(coordinates);

        // Update map center and marker
        this.mapOptions.center = clampedCoordinates;
        this.markerCoords = clampedCoordinates;

        // Set the new center and update the map
        this.map.setView(clampedCoordinates, this.mapOptions.zoom);
      } else {
        alert("Invalid address. Please enter a valid address.");
      }
    },
    clampCoordinates(coordinates) {
      const [lat, lng] = coordinates;

      // Clamp latitude and longitude within St. Paul's bounding box
      const clampedLat = Math.min(
        Math.max(lat, this.mapBounds[0][0]),
        this.mapBounds[1][0]
      );
      const clampedLng = Math.min(
        Math.max(lng, this.mapBounds[0][1]),
        this.mapBounds[1][1]
      );

      return [clampedLat, clampedLng];
    },
    updateLocation() {
      // Update the input box text when the map is panned or zoomed
      const center = this.map.getCenter();
      this.locationInput = `${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}`;
    },
    async getCoordinatesFromAddress(address) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}`
        );

        const data = await response.json();

        if (data && data.length > 0) {
          return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }

        return null;
      } catch (error) {
        console.error("Error fetching coordinates from Nominatim API:", error);
        return null;
      }
    },
  },
};
</script>

<style scoped>
#map {
  height: 400px; /* Adjust the height as needed */
}
</style>
