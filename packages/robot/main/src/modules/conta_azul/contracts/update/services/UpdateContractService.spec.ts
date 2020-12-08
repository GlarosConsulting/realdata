import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';
import testingCustomersConfig from '@config/testing_customers';

import formatIxcContractProductsToContaAzul from '@utils/formatIxcContractProductsToContaAzul';

import NavigateToContractDetailsPageService from '@modules/conta_azul/contracts/details/services/NavigateToContractDetailsPageService';
import FindContractsByCustomerNameService from '@modules/conta_azul/contracts/main/services/FindContractsByCustomerNameService';
import NavigateToContractsPageService from '@modules/conta_azul/contracts/main/services/NavigateToContractsPageService';
import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import NavigateToUpdateContractPageService from './NavigateToUpdateContractPageService';
import UpdateContractService from './UpdateContractService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToContractsPage: NavigateToContractsPageService;
let findContractsByCustomerName: FindContractsByCustomerNameService;
let navigateToContractDetailsPage: NavigateToContractDetailsPageService;
let navigateToUpdateContractPage: NavigateToUpdateContractPageService;
let updateContract: UpdateContractService;

let browser: Browser;
let page: Page;

describe('UpdateContract', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch({ headless: false });
  });

  beforeEach(async () => {
    page = await browser.newPage();

    navigateToLogInPage = new NavigateToLogInPageService(page);
    authenticateUser = new AuthenticateUserService(page);
    navigateToContractsPage = new NavigateToContractsPageService(page);
    findContractsByCustomerName = new FindContractsByCustomerNameService(page);
    navigateToContractDetailsPage = new NavigateToContractDetailsPageService(
      page,
    );
    navigateToUpdateContractPage = new NavigateToUpdateContractPageService(
      page,
    );
    updateContract = new UpdateContractService(page);
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to update contract products', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToContractsPage.execute();

    const testingCustomer = testingCustomersConfig[2];

    const [contract] = await findContractsByCustomerName.execute({
      name:
        testingCustomer.ixc.details.main.person_type === 'fisica'
          ? testingCustomer.name
          : testingCustomer.ixc.fantasy_name,
    });

    await navigateToContractDetailsPage.execute({ contract });

    await navigateToUpdateContractPage.execute();

    const testingContract = testingCustomer.ixc.details.contracts[0];

    await updateContract.execute(
      {
        products: formatIxcContractProductsToContaAzul(
          testingContract.products.items,
        ),
      },
      false,
    );
  });
});
