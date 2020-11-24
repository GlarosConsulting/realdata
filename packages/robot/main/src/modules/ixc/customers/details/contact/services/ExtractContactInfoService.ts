import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import IContactIXC from '@modules/ixc/customers/details/contact/models/IContactIXC';

@injectable()
export default class ExtractContactInfoService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IContactIXC> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const contactInfo = await this.page.evaluate<IContactIXC>(() => {
      const phone_mobile = document.querySelector<HTMLInputElement>(
        '#telefone_celular',
      ).value;
      const phone_home = document.querySelector<HTMLInputElement>('#fone')
        .value;
      const phone_commercial = document.querySelector<HTMLInputElement>(
        '#telefone_comercial',
      ).value;
      const whatsapp = document.querySelector<HTMLInputElement>('#whatsapp')
        .value;
      const email = document.querySelector<HTMLInputElement>('#email').value;

      return {
        phone_mobile,
        phone_home,
        phone_commercial,
        whatsapp,
        email,
      };
    });

    return contactInfo;
  }
}
