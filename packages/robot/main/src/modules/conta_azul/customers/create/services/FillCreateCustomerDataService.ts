import { format, parseISO } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

export const PERSON_TYPES = {
  juridica:
    'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(1) > div > fieldset > div > div:nth-child(1) > div.ds-col.ds-col-3 > div > div > div > div > div > div:nth-child(1) > button',
  fisica:
    'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(1) > div > fieldset > div > div:nth-child(1) > div.ds-col.ds-col-3 > div > div > div > div > div > div:nth-child(2) > button',
};

interface IRequest {
  person_type: keyof typeof PERSON_TYPES;
  document: string;
  name: string;
  fantasy_name: string;
  ixc_id: string;
  additional_info: {
    email: string;
    phone_commercial: string;
    phone_mobile: string;
    birth_date: string;
    identity: string;
  };
  address: {
    cep: string;
    number: string;
    complement: string;
  };
}

@injectable()
export default class FillCreateCustomerDataService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(
    {
      person_type,
      document: document_value,
      name,
      fantasy_name,
      ixc_id,
      additional_info,
      address,
    }: IRequest,
    dontSave = true,
  ): Promise<void> {
    const [
      findCreateCustomerTitleElement,
    ] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(1) > div > fieldset > legend > h3',
    );

    if (!findCreateCustomerTitleElement) {
      throw new AppError('You should be in create customers page.');
    }

    /* istanbul ignore next */
    await this.page.evaluate(selector => {
      document.querySelector<HTMLElement>(selector).click();
    }, PERSON_TYPES[person_type]);

    const [findDocumentInputElement] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(1) > div > fieldset > div > div:nth-child(1) > div.ds-col.ds-col-4 > div > div input',
    );

    await this.page.typeToElement(findDocumentInputElement, document_value);

    const [findNameInputElement] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(1) > div > fieldset > div > div:nth-child(1) > div.ds-col.ds-col-5 > div > div.ds-input__container > input',
    );

    if (person_type === 'fisica' || !fantasy_name) {
      await this.page.typeToElement(findNameInputElement, name);
    } else if (person_type === 'juridica') {
      await this.page.typeToElement(findNameInputElement, fantasy_name);
    }

    const [findRegisterIdInputElement] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(1) > div > fieldset > div > div:nth-child(2) > div.ds-col.ds-col-3 > div > div > input',
    );

    await this.page.typeToElement(findRegisterIdInputElement, ixc_id);

    const [findEmailInputElement] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(2) > div > div > div.ds-height-transition.ds-collapse-body > div > div > div > div:nth-child(1) > div.ds-col.ds-col-5 > div > div > input',
    );

    await this.page.typeToElement(findEmailInputElement, additional_info.email);

    const [
      findCommercialPhoneInputElement,
    ] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(2) > div > div > div.ds-height-transition.ds-collapse-body > div > div > div > div:nth-child(1) > div:nth-child(2) > div > div > input',
    );

    await this.page.typeToElement(
      findCommercialPhoneInputElement,
      additional_info.phone_commercial,
    );

    const [
      findMobilePhoneInputElement,
    ] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(2) > div > div > div.ds-height-transition.ds-collapse-body > div > div > div > div:nth-child(1) > div:nth-child(3) > div > div > input',
    );

    await this.page.typeToElement(
      findMobilePhoneInputElement,
      additional_info.phone_mobile,
    );

    const [findBirthDateInputElement] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(2) > div > div > div.ds-height-transition.ds-collapse-body > div > div > div > div:nth-child(1) > div.ds-col.ds-col-3 > div > span > div > div > input',
    );

    await this.page.typeToElement(
      findBirthDateInputElement,
      format(parseISO(additional_info.birth_date), 'dd/MM/yyyy'),
    );

    if (person_type === 'fisica') {
      const [findRGInputElement] = await this.page.findElementsBySelector(
        'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(2) > div > div > div.ds-height-transition.ds-collapse-body > div > div > div > div:nth-child(2) > div > div > div > input',
      );

      await this.page.typeToElement(
        findRGInputElement,
        additional_info.identity,
      );
    } else if (person_type === 'juridica') {
      const [
        findRazaoSocialInputElement,
      ] = await this.page.findElementsBySelector(
        'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(3) > div > div > div.ds-height-transition.ds-collapse-body > div > div > div > div:nth-child(1) > div.ds-col.ds-col-6 > div > div > input',
      );

      await this.page.typeToElement(findRazaoSocialInputElement, name);

      const [
        findInscricaoEstadualInputElement,
      ] = await this.page.findElementsBySelector(
        'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(3) > div > div > div.ds-height-transition.ds-collapse-body > div > div > div > div:nth-child(2) > div:nth-child(2) > div > div > input',
      );

      await this.page.typeToElement(
        findInscricaoEstadualInputElement,
        additional_info.identity,
      );
    }

    const [findCEPInputElement] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(4) > div > div > div.ds-height-transition.ds-collapse-body > div > div > div > div:nth-child(1) > div:nth-child(2) > div > div > div.ds-u-flex-grow > div > input',
    );

    await this.page.typeToElement(findCEPInputElement, address.cep);

    const [findSearchCEPButtonElement] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(4) > div > div > div.ds-height-transition.ds-collapse-body > div > div > div > div:nth-child(1) > div:nth-child(2) > div > div > div.ds-input-addon--align-right > div > span > button',
    );

    await findSearchCEPButtonElement.click();

    await sleep(1000);

    const [
      findAddressNumberInputElement,
    ] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(4) > div > div > div.ds-height-transition.ds-collapse-body > div > div > div > div:nth-child(1) > div:nth-child(4) > div > div > input',
    );

    await this.page.typeToElement(
      findAddressNumberInputElement,
      address.number,
    );

    const [
      findAddressComplementInputElement,
    ] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(4) > div > div > div.ds-height-transition.ds-collapse-body > div > div > div > div:nth-child(2) > div.ds-col.ds-col-4 > div > div > input',
    );

    await this.page.typeToElement(
      findAddressComplementInputElement,
      address.complement,
    );

    const [
      findObservationsCollapseElement,
    ] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(6) > div > div > div.ds-collapse-head',
    );

    await findObservationsCollapseElement.click();

    const [
      findObservationsTextareaElement,
    ] = await this.page.findElementsBySelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div:nth-child(6) > div > div > div.ds-height-transition.ds-collapse-body > div > div > div > div > div > div > textarea',
    );

    await this.page.typeToElement(
      findObservationsTextareaElement,
      `Código IXC: ${ixc_id}`,
    );

    await sleep(1000);

    await findObservationsTextareaElement.press('Enter');

    await this.page.typeToElement(
      findObservationsTextareaElement,
      `Data e hora: ${format(Date.now(), "dd/MM/yyyy 'às' HH:mm")}`,
    );

    await sleep(1000);

    if (!dontSave) {
      const [findSaveButtonElement] = await this.page.findElementsBySelector(
        'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__body.has-footer > div > div > form > div > div > div.ds-footer.ds-rollover-footer > div > div > span > button',
      );

      await findSaveButtonElement.click();
    }

    await sleep(2000);

    await this.page.driver.waitForSelector(
      '#gateway > section > div > div.ds-page > div > div > div > div.ds-row.ds-data-grid__table-container > div > div > table > tbody > tr > td:nth-child(2)',
    );

    await sleep(1000);
  }
}
