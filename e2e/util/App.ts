export class App {
  static async launch() {
    await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } });
  }
}
