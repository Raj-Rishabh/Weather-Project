const express = require("express");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  var stringLength = query.length;
  const apiKey = "d758a50651e168c03173cc03e994ea17";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=metric";
  https.get(url, function (response) {
    console.log(response);

    if (stringLength == 0) {
      response.on("data", function (data) {
        const img =
          "https://www.wpoven.com/blog/wp-content/uploads/2022/09/error-404.png";
        res.write("<h1>Invalid City Name  </h1>");
        res.write("<img src=" + img + ">");
        res.send();
      });
    } else {
      response.on("data", function (data) {
        // console.log(data); //At the moment it will give hexadecimal value wich we have to convert in understandable form like JSON
        const weatherData = JSON.parse(data);
        console.log(weatherData);
        // const object = {
        //     name: "Raj",                    //this particular code will change simple sentance to object (or dictionary)
        //     favFood:"Nothing"
        // }
        // console.log(JSON.stringify(object));

        const temp = weatherData.main.temp;
        const weatherDiscription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@4x.png";
        res.write(
          "<h1>The temperature in " +
            query +
            " is " +
            temp +
            " degree Celcius. </h1>"
        );
        res.write(
          "<p>The weather is currently " + weatherDiscription + ".</p>"
        );
        res.write("<img src=" + imageUrl + ">");
        res.send();
      });
    } //flmflmf
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
