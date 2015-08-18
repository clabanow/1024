describe("Tile", function() {
  var tile;

  beforeEach(function() {
    tile = new Tile(0, '_0');
  });

  it('should have default value of 2', function() {
    expect(tile.value).toEqual(2);
  });
})