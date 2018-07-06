// $("#scrape").on("click", function() {
//   $.ajax({
//       method: "GET",
//       url: "/scrape",
//   }).done(function(data) {
//       console.log(data)
//       window.location = "/"
//   })
// });

//Handle Save Article button
// $(".save").on("click", function() {
//   var thisId = $(this).find('button').attr("data-id");
//   $.ajax({
//       method: "POST",
//       url: "/saved/" + thisId
//   }).done(function(data) {
//       window.location = "/"
//   })
// });
// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var card = $('<div>');
    card.html("<h3><a target='_blank' rel='noopener noreferrer' href='" + data[i].link + "'>" + data[i].title + "</a></h3><br><p>" + data[i].excerpt + "</p><a data-id='" + data[i]._id + "' class='btn btn-success save'>Save Article</a><br>");
    card.addClass("article-div");
    $(".articles").append(card);
  }
});

$.getJSON("/saved", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var savedCard = $('<div>');
    savedCard.html("<p><h3><a target='_blank' rel='noopener noreferrer' href='" + data[i].link + "'>" + data[i].title + "</a></h3><br>" + data[i].excerpt + "<a data-id='" + data[i]._id + "' class='btn btn-danger delete'>Delete Article</a></p><br>");
    savedCard.addClass("saved-div");
    $(".saved-articles").append(savedCard); 
  }
});
$("#scrape-articles").on("click", function() {
  console.log("yup");
  $.ajax({
    method: "GET",
    url: "/scrape/"
  })
      .then(function(data) {
      console.log(data);
      location.reload();
      });
});

$("#clear").on("click", function() {
  console.log("yup");
  $.ajax({
    method: "POST",
    url: "/articles/",
    data: JSON.stringify({}),
  })
      .then(function(data) {
      console.log(data);
        // location.reload();
      });
});

// Whenever someone clicks a p tag
$(document).on("click", ".article-div", function() {
  // Empty the notes from the note section
  // $("#notes").empty();
  // // Save the id from the p tag
  var thisId = $(this).find('a.save').attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data:
       {
          "saved": true
       }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      console.log(data.saved)
      // Empty the notes section
    });
  // Now make an ajax call for the Article
  // $.ajax({
  //   method: "GET",
  //   url: "/articles/" + thisId
  // })
  //   // With that done, add the note information to the page
  //   .then(function(data) {
  //     console.log(data.saved);
      
  //     // The title of the article
  //     $("#notes").append("<h2>" + data.title + "</h2>");
  //     // An input to enter a new title
  //     // $("#notes").append("<input id='titleinput' name='title' >");
  //     // A textarea to add a new note body
  //     $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
  //     // A button to submit a new note, with the id of the article saved to it
  //     $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

  //     // If there's a note in the article
  //     if (data.note) {
  //       // Place the title of the note in the title input
  //       $("#titleinput").val(data.note.title);
  //       // Place the body of the note in the body textarea
  //       $("#bodyinput").val(data.note.body);
  //     }
  //   });
});

$(document).on("click", ".saved-div", function() {
  // Empty the notes from the note section
  // $("#notes").empty();
  // // Save the id from the p tag
  var thisId = $(this).find('a.delete').attr("data-id");
  $.ajax({
    method: "POST",
    url: "/saved/" + thisId,
    data:
       {
          "saved": false
       }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      console.log(data.saved)
      location.reload();
      // Empty the notes section
    });
  });
// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).find("a").attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
