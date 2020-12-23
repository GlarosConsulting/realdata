import puppeteer, { LaunchOptions } from 'puppeteer';

import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';

import IBrowserProvider from '../models/IBrowserProvider';

class PuppeteerBrowserProvider implements IBrowserProvider<Browser> {
  public async launch(options?: LaunchOptions): Promise<Browser> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
      ...options,
    });

    return new Browser(browser);
  }
}

export default PuppeteerBrowserProvider;
