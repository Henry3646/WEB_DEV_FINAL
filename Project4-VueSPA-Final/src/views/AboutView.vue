<!-- About.vue -->
<template>
  <div class="about">
    <h2>About the Project</h2>

    <section>
      <h3>Team Members</h3>
      <div v-for="member in teamMembers" :key="member.id" class="team-member">
        <img :src="member.photo" :alt="member.name" />
        <div>
          <h4>{{ member.name }}</h4>
          <p>{{ member.bio }}</p>
        </div>
      </div>
    </section>

    <section>
  <h3>Tools Used</h3>
  <p>
    Our team utilized a powerful set of tools, frameworks, and APIs to bring this application to life. Each component played a crucial role in shaping the functionality and user experience of our project. Here's a glimpse into the technologies that powered this endeavor:

    <ul>
      <li><strong>Vue.js:</strong> The core of our front-end development, Vue.js provided a flexible and efficient framework for building dynamic user interfaces.</li>
      
      <li><strong>Leaflet:</strong> For interactive and responsive mapping features, we harnessed the capabilities of Leaflet, a leading open-source JavaScript library.</li>
      
      <li><strong>Nominatim API:</strong> We seamlessly integrated the Nominatim API for geocoding, enabling us to convert addresses into geographic coordinates and vice versa.</li>
      
      <li><strong>Express.js:</strong> Our back-end server was powered by Express.js, a minimalist web application framework for Node.js, facilitating smooth server-side operations.</li>
      
      <li><strong>SQLite:</strong> The choice of SQLite as our database system provided a lightweight and efficient solution for storing and retrieving data.</li>
    </ul>

    These technologies, carefully selected and integrated, contributed to the robust and user-friendly nature of our application. We're proud to showcase the synergy of these tools that made this project possible.
  </p>
</section>

  </div>
</template>

<script>
export default {
  data() {
    return {
      teamMembers: [
        {
          id: 1,
          name: "John Doe",
          bio: "Short bio about John Doe.",
          photo: "/assets/john_doe.jpg", // Replace with the actual path to the photo
        },
        // Add more team members as needed
      ],
    };
  },
};
</script>

<style scoped>
.about {
  padding: 20px;
}

.team-member {
  display: flex;
  margin-bottom: 20px;
}

.team-member img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}
</style>
