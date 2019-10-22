const request = require("request");

const forecast = (latt, long, callback) => {
    const url = `https://api.darksky.net/forecast/2f9037e565d55c2987c624ee3ad23551/${latt},${long}?units=uk2`;
    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback("Cannot contact weather service!", undefined);
        } else if (body.error) {
            callback("Cannot find forecast for location", undefined);
        } else {
            let currently = body.currently
            callback(undefined, `${body.daily.data[0].summary} It is currently ${currently.temperature} degrees out. There is a ${currently.precipProbability}% chance of rain. The current wind speed is ${currently.windSpeed} mph.`)
        }
    });
};

module.exports = forecast
