import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import IAddressIXC from '@modules/ixc/customers/details/address/models/IAddressIXC';

@injectable()
export default class ExtractAddressInfoService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IAddressIXC> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const addressInfo = await this.page.evaluate<IAddressIXC>(() => {
      const cep = document.querySelector<HTMLInputElement>('#cep').value;
      const address = document.querySelector<HTMLInputElement>('#endereco')
        .value;
      const number = document.querySelector<HTMLInputElement>('#numero').value;
      const complement = document.querySelector<HTMLInputElement>(
        '#complemento',
      ).value;
      const neighborhood = document.querySelector<HTMLInputElement>('#bairro')
        .value;
      const city = document.querySelector<HTMLInputElement>('#cidade_label')
        .value;

      return {
        cep,
        address,
        number,
        complement,
        neighborhood,
        city,
      };
    });

    return addressInfo;
  }
}
