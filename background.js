// Define an array of image names
/* var images = ["/images/annie-spratt-xmas.jpg",
              "/images/movie-popcorn-ai.jpg",
              "/images/christmas-theme-ai.jpg",
              "/images/grinch.jpg",
              "/images/santa-clause.jpg",
              "/images/wonderful-life.png",
              "/images/christmas-theme.jpg",
              "/images/mistletoe.png",
              "/images/reindeer-games.jpg",
              "/images/rockin-around.png",
              "/images/santa-tell-me.jpg",
              "/images/jingle-bell-rock.jpg",
              "/images/christmas-clipart.jpg",
              "/images/christmas-hollis.png",
              "/images/santa-music.jpg",
              "/images/santa-movie.jpg"]; */

var images = ["/images/rockin-around.png"];

// Define a function to generate a random index
function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

// Define a function to change the background image
function changeBackgroundImage() {
  // Get the body element
  var body = document.getElementsByTagName("body")[0];

  // Get a random index from the images array
  var index = getRandomIndex(images.length);

  // Get the image name from the array
  var image = images[index];

  // Set the background image of the body element
  body.style.backgroundImage = "url('" + image + "')";
}