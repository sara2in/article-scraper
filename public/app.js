$.getJSON("/articles", function (data) {
  for (var i = 0; i < data.length; i++) {
    var card = $('<div>');
    card.html("<h3><a target='_blank' rel='noopener noreferrer' href='" + data[i].link + "'>" + data[i].title + "</a></h3><br><p>" + data[i].excerpt + "</p><br><a data-id='" + data[i]._id + "'class='btn btn-success save'>Save Article</a><br><br>");
    card.addClass("article-div");
    $(".articles").append(card);
  }
});

$.getJSON("/saved", function (data) {
  for (var i = 0; i < data.length; i++) {
    var savedCard = $('<div>');
    savedCard.html("<p><h3><a target='_blank' rel='noopener noreferrer' href='" + data[i].link + "'>" + data[i].title + "</a></h3><br>" + data[i].excerpt + "<br><button type='button' data-toggle='modal' data-target='#exampleModal' data-id='" + data[i]._id + "' class='btn btn-warning note'>Notes</button><a data-id='" + data[i]._id + "' class='btn btn-danger delete'>Delete Article</a></p><br><br>");
    savedCard.addClass("saved-div");
    $(".saved-articles").append(savedCard);
  }
});

$("#scrape-articles").on("click", function (event) {
  event.preventDefault();
  console.log("yup");
  $.ajax({
    method: "GET",
    url: "/scrape/"
  })
  .then(function (data) {
    console.log(data);   
    window.location = "/";
  });
});

$("#clear").on("click", function (event) {
  event.preventDefault();
  console.log("yup");
  $.ajax({
    method: "DELETE",
    url: "/articles/",
    data: JSON.stringify([])
  })
    .then(function (data) {
      console.log('Success')
      console.log(data);
      window.location = "/";
    });
});

$(document).on("click", ".article-div .save", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data:
    {
      "saved": true
    }
  })
    .then(function (data) {
      console.log(data);
      console.log(data.saved)
    });
});

$(document).on("click", ".saved-div .delete", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/saved/" + thisId,
    data:
    {
      "saved": false
    }
  })
    .then(function (data) {
      console.log(data);
      console.log(data.saved)
      location.reload();
    });
});

$(document).on("click", ".saved-div .note", function () {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET", 
    url: "/articles/" + thisId
  })
    .then(function (data) {
      console.log(data.note);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button class='btn btn-success' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }

    });
});

$(document).on("click", "#savenote", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function (data) {
      console.log(data);
    });
    $('#exampleModal').modal('toggle');
});
