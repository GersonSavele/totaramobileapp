describe("Site Url screen", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should have url input", async () => {
    await expect(element(by.label('Enter url'))).toBeVisible();
    // await expect(element(by.id('urlInput'))).toBeVisible();
    // element by id doesn't seem to work.  The testID has been set, I can also
    // see it on React Native debugger the id is set on the component
    // this needs further investigation
  });
});
