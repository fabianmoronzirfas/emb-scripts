/**
 * reset the FC fields
 * @return {nothing}
 */
var reset = function() {
  // now empty the find what field!!!thats important!!!
  app.findGrepPreferences = NothingEnum.nothing;
  app.findTextPreferences = NothingEnum.nothing;

  // empts the change to field!!!thats important!!!
  app.changeGrepPreferences = NothingEnum.nothing;
  app.findTextPreferences = NothingEnum.nothing;
};

