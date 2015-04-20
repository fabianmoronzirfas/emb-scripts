var units = {};
units.get = function(d) {
  var u = {
    "horizontal": d.viewPreferences.horizontalMeasurementUnits,
    "vertical": d.viewPreferences.verticalMeasurementUnits

  };
  return u;
};
units.set = function(d, u) {
  d.viewPreferences.horizontalMeasurementUnits = u.horizontal;
  d.viewPreferences.verticalMeasurementUnits = u.vertical;
};