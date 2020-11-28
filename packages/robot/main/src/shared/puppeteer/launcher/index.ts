import { addDays, isAfter, isBefore, set as setDate, subDays } from 'date-fns';
import { container, injectable, inject } from 'tsyringe';

import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import IBrowser from '@robot/shared/modules/browser/models/IBrowser';
import IBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/models/IBrowserProvider';

import formatIxcContractProductsToContaAzul from '@utils/formatIxcContractProductsToContaAzul';
import Timer from '@utils/timer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IConfigurationProvider from '@shared/container/providers/ConfigurationProvider/models/IConfigurationProvider';
import IExtendedCustomerIXC from '@shared/models/IExtendedCustomerIXC';
import api from '@shared/services/api';

import ContaAzulBillsToReceiveDetailsPage from '@modules/conta_azul/bills_to_receive/details/infra/puppeteer/pages/ContaAzulBillsToReceiveDetailsPage';
import ContaAzulBillToReceiveMainPage from '@modules/conta_azul/bills_to_receive/main/infra/puppeteer/pages/ContaAzulBillToReceiveMainPage';
import ContaAzulContractsCreatePage from '@modules/conta_azul/contracts/create/infra/puppeteer/pages/ContaAzulContractsCreatePage';
import ContaAzulCustomersCreatePage from '@modules/conta_azul/customers/create/infra/puppeteer/pages/ContaAzulCustomersCreatePage';
import ContaAzulCustomersMainPage from '@modules/conta_azul/customers/main/infra/puppeteer/pages/ContaAzulCustomersMainPage';
import ContaAzulLogInHandler from '@modules/conta_azul/login/infra/handlers';
import CustomersDetailsAddressIXCPage from '@modules/ixc/customers/details/address/infra/puppeteer/pages/CustomersDetailsAddressIXCPage';
import CustomersDetailsContactIXCPage from '@modules/ixc/customers/details/contact/infra/puppeteer/pages/CustomersDetailsContactIXCPage';
import CustomersDetailsContractIXCPage from '@modules/ixc/customers/details/contract/infra/puppeteer/pages/CustomersDetailsContractIXCPage';
import CustomersDetailsFinanceIXCPage from '@modules/ixc/customers/details/finance/infra/puppeteer/pages/CustomersDetailsFinanceIXCPage';
import CustomersDetailsMainIXCPage from '@modules/ixc/customers/details/main/infra/puppeteer/pages/CustomersDetailsMainIXCPage';
import CustomersMainIXCPage from '@modules/ixc/customers/main/infra/puppeteer/pages/CustomersMainIXCPage';
import IXCLogInHandler from '@modules/ixc/login/infra/handlers';

@injectable()
export default class Launcher {
  constructor(
    @inject('ConfigurationProvider')
    private configurationProvider: IConfigurationProvider,

    @inject('BrowserProvider')
    private browserProvider: IBrowserProvider<Browser>,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async launch(): Promise<void> {
    const {
      ixc: { email },
      headless,
    } = await this.configurationProvider.pick(['ixc', 'headless']);

    const timer = new Timer(`realdata-robot-${email}`);

    timer.start();

    const browser = await this.browserProvider.launch({ headless });

    const page1 = await browser.newPage();
    const page2 = await browser.newPage();

    container.registerInstance<IBrowser<any, any>>('Browser', browser);

    await browser.run(page1, IXCLogInHandler);
    await browser.run(page2, ContaAzulLogInHandler);

    const switchPage = (page: Page) => {
      page.driver.bringToFront();
      container.registerInstance('Page', page);
    };

    // const ixcIds = testingCustomersConfig.map(customer => customer.ixc.id);
    // const ixcIds = ['12636']; // KARLA ANGELINA
    // const ixcIds = ['14211']; // GLAROS
    // const ixcIds = ['10902']; // LUCAS SILVA NERES
    // const ixcIds = ['10863']; // RAPHAEL
    // const ixcIds = ['10981']; // Star Brasil Distribuidora de Produtos LTDA
    // const ixcIds = ['11002']; // Perfilbrás Indústria e Comércio LTDA
    // const ixcIds = ['10877']; // Ghia Car Auto Portas Ltda
    // const ixcIds = ['10979']; // William de Moro
    // const ixcIds = ['10930']; // Luis Otavio Soares de Andrade

    const ixcIds = [];
    const usedIxcIds = [
      '10626',
      '10627',
      '10628',
      '10629',
      '10630',
      '10631',
      '10632',
      '10633',
      '10634',
      '10635',
      '10636',
      '10637',
      '10638',
      '10639',
      '10640',
      '10641',
      '10642',
      '10643',
      '10644',
      '10645',
      '10646',
      '10647',
      '10648',
      '10649',
      '10650',
      '10651',
      '10652',
      '10653',
      '10654',
      '10655',
      '10656',
      '10657',
      '10658',
      '10659',
      '10660',
      '10661',
      '10662',
      '10663',
      '10664',
      '10665',
      '10666',
      '10667',
      '10668',
      '10669',
      '10670',
      '10671',
      '10672',
      '10673',
      '10674',
      '10675',
      '10676',
      '10677',
      '10678',
      '10679',
      '10680',
      '10681',
      '10682',
      '10683',
      '10684',
      '10685',
      '10686',
      '10687',
      '10688',
      '10689',
      '10690',
      '10691',
      '10692',
      '10693',
      '10694',
      '10695',
      '10696',
      '10697',
      '10698',
      '10699',
      '10700',
      '10701',
      '10702',
      '10703',
      '10704',
      '10705',
      '10706',
      '10707',
      '10708',
      '10709',
      '10710',
      '10711',
      '10712',
      '10713',
      '10714',
      '10715',
      '10716',
      '10717',
      '10718',
      '10719',
      '10720',
      '10721',
      '10722',
      '10723',
      '10724',
      '10725',
      '10726',
      '10727',
      '10728',
      '10729',
      '10730',
      '10731',
      '10732',
      '10733',
      '10734',
      '10735',
      '10736',
      '10737',
      '10738',
      '10739',
      '10740',
      '10741',
      '10742',
      '10743',
      '10744',
      '10745',
      '10746',
      '10747',
      '10748',
      '10749',
      '10750',
      '10751',
      '10752',
      '10753',
      '10754',
      '10755',
      '10756',
      '10757',
      '10758',
      '10759',
      '10760',
      '10761',
      '10762',
      '10763',
      '10764',
      '10765',
      '10766',
      '10767',
      '10768',
      '10769',
      '10770',
      '10771',
      '10772',
      '10773',
      '10774',
      '10775',
      '10776',
      '10777',
      '10778',
      '10779',
      '10780',
      '10781',
      '10782',
      '10783',
      '10784',
      '10785',
      '10786',
      '10787',
      '10788',
      '10789',
      '10790',
      '10791',
      '10792',
      '10793',
      '10794',
      '10795',
      '10796',
      '10797',
      '10798',
      '10799',
      '10800',
      '10801',
      '10802',
      '10803',
      '10804',
      '10805',
      '10806',
      '10807',
      '10808',
      '10809',
      '10810',
      '10811',
      '10812',
      '10813',
      '10814',
      '10815',
      '10816',
      '10817',
      '10818',
      '10819',
      '10820',
      '10821',
      '10822',
      '10823',
      '10824',
      '10825',
      '10826',
      '10827',
      '10828',
      '10829',
      '10830',
      '10831',
      '10832',
      '10833',
      '10834',
      '10835',
      '10836',
      '10837',
      '10838',
      '10839',
      '10840',
      '10841',
      '10842',
      '10843',
      '10844',
      '10845',
      '10846',
      '10847',
      '10848',
      '10849',
      '10850',
      '10851',
      '10852',
      '10853',
      '10854',
      '10855',
      '10856',
      '10857',
      '10858',
      '10859',
      '10860',
      '10861',
      '10862',
      '10863',
      '10864',
      '10865',
      '10866',
      '10867',
      '10868',
      '10869',
      '10870',
      '10871',
      '10872',
      '10873',
      '10874',
      '10875',
      '10876',
      '10877',
      '10878',
      '10879',
      '10880',
      '10881',
      '10882',
      '10883',
      '10884',
      '10885',
      '10886',
      '10887',
      '10888',
      '10889',
      '10890',
      '10891',
      '10892',
      '10893',
      '10894',
      '10895',
      '10896',
      '10897',
      '10898',
      '10899',
      '10900',
      '10901',
      '10902',
      '10903',
      '10904',
      '10905',
      '10906',
      '10907',
      '10908',
      '10909',
      '10910',
      '10911',
      '10912',
      '10913',
      '10914',
      '10915',
      '10916',
      '10917',
      '10918',
      '10919',
      '10920',
      '10921',
      '10922',
      '10923',
      '10924',
      '10925',
      '10926',
      '10927',
      '10928',
      '10929',
      '10930',
      '10931',
      '10932',
      '10933',
      '10934',
      '10935',
      '10936',
      '10937',
      '10938',
      '10939',
      '10940',
      '10941',
      '10942',
      '10943',
      '10944',
      '10945',
      '10946',
      '10947',
      '10948',
      '10949',
      '10950',
      '10951',
      '10952',
      '10953',
      '10954',
      '10955',
      '10956',
      '10957',
      '10958',
      '10959',
      '10960',
      '10961',
      '10962',
      '10963',
      '10964',
      '10965',
      '10966',
      '10967',
      '10968',
      '10969',
      '10970',
      '10971',
      '10972',
      '10973',
      '10974',
      '10975',
      '10976',
      '10977',
      '10978',
      '10979',
      '10980',
      '10981',
      '10982',
      '10983',
      '10984',
      '10985',
      '10986',
      '10987',
      '10988',
      '10989',
      '10990',
      '10991',
      '10992',
      '10993',
      '10994',
      '10995',
      '10996',
      '10997',
      '10998',
      '10999',
      '11000',
      '11001',
      '11002',
      '11003',
      '11004',
      '11005',
      '11006',
      '11007',
      '11008',
      '11009',
      '11010',
      '11011',
      '11012',
      '11013',
      '11014',
      '11015',
      '11016',
      '11017',
      '11018',
      '11019',
      '11020',
      '11021',
      '11022',
      '11023',
      '11024',
      '11025',
      '11026',
      '11027',
      '11028',
      '11029',
      '11030',
      '11031',
      '11032',
      '11033',
      '11034',
      '11035',
      '11036',
      '11037',
      '11038',
      '11039',
      '11040',
      '11041',
      '11042',
      '11043',
      '11044',
      '11045',
      '11046',
      '11047',
      '11048',
      '11049',
      '11050',
      '11051',
      '11052',
      '11053',
      '11054',
      '11055',
      '11056',
      '11057',
      '11058',
      '11059',
      '11060',
      '11061',
      '11062',
      '11063',
      '11064',
      '11065',
      '11066',
      '11067',
      '11068',
      '11069',
      '11070',
      '11071',
      '11072',
      '11073',
      '11074',
      '11075',
      '11076',
      '11077',
      '11078',
      '11079',
      '11080',
      '11081',
      '11082',
      '11083',
      '11084',
      '11085',
      '11086',
      '11087',
      '11088',
      '11089',
      '11090',
      '11091',
      '11092',
      '11093',
      '11094',
      '11095',
      '11096',
      '11097',
      '11098',
      '11099',
      '11100',
      '11101',
      '11102',
      '11103',
      '11104',
      '11105',
      '11106',
      '11107',
      '11108',
      '11109',
      '11110',
      '11111',
      '11112',
      '11113',
      '11114',
      '11115',
      '11116',
      '11117',
      '11118',
      '11119',
      '11120',
      '11121',
      '11122',
      '11123',
      '11124',
      '11125',
      '11126',
      '11127',
      '11128',
      '11129',
      '11130',
      '11131',
      '11132',
      '11133',
      '11134',
      '11135',
      '11136',
      '11137',
      '11138',
      '11139',
      '11140',
      '11141',
      '11142',
      '11143',
      '11144',
      '11145',
      '11146',
      '11147',
      '11148',
      '11149',
      '11150',
      '11151',
      '11152',
      '11153',
      '11154',
      '11155',
      '11156',
      '11157',
      '11158',
      '11159',
      '11160',
      '11161',
      '11162',
      '11163',
      '11164',
      '11165',
      '11166',
      '11167',
      '11168',
      '11169',
      '11170',
      '11171',
      '11172',
      '11173',
      '11174',
      '11175',
      '11176',
      '11177',
      '11178',
      '11179',
      '11180',
      '11181',
      '11182',
      '11183',
      '11184',
      '11185',
      '11186',
      '11187',
      '11188',
      '11189',
      '11190',
      '11191',
      '11192',
      '11193',
      '11194',
      '11195',
      '11196',
      '11197',
      '11198',
      '11199',
      '11200',
      '11201',
      '11202',
      '11203',
      '11204',
      '11205',
      '11206',
      '11207',
      '11208',
      '11209',
      '11210',
      '11211',
      '11212',
      '11213',
      '11214',
      '11215',
      '11216',
      '11217',
      '11218',
      '11219',
      '11220',
      '11221',
      '11222',
      '11223',
      '11224',
      '11225',
      '11226',
      '11227',
      '11228',
      '11229',
      '11230',
      '11231',
      '11232',
      '11233',
      '11234',
      '11235',
      '11236',
      '11237',
      '11238',
      '11239',
      '11240',
      '11241',
      '11242',
      '11243',
      '11244',
      '11245',
      '11246',
      '11247',
      '11248',
      '11249',
      '11250',
      '11251',
      '11252',
      '11253',
      '11254',
      '11255',
      '11256',
      '11257',
      '11258',
      '11259',
      '11260',
      '11261',
      '11262',
      '11263',
      '11264',
      '11265',
      '11266',
      '11267',
      '11268',
      '11269',
      '11270',
      '11271',
      '11272',
      '11273',
      '11274',
      '11275',
      '11276',
      '11277',
      '11278',
      '11279',
      '11280',
      '11281',
      '11282',
      '11283',
      '11284',
      '11285',
      '11286',
      '11287',
      '11288',
      '11289',
      '11290',
      '11291',
      '11292',
      '11293',
      '11294',
      '11295',
      '11296',
      '11297',
      '11298',
      '11299',
      '11300',
      '11301',
      '11302',
      '11303',
      '11304',
      '11305',
      '11306',
      '11307',
      '11308',
      '11309',
      '11310',
      '11311',
      '11312',
      '11313',
      '11314',
      '11315',
      '11316',
      '11317',
      '11318',
      '11319',
      '11320',
      '11321',
      '11322',
      '11323',
      '11324',
      '11325',
      '11326',
      '11327',
      '11328',
      '11329',
      '11330',
      '11331',
      '11332',
      '11333',
      '11334',
      '11335',
      '11336',
      '11337',
      '11338',
      '11339',
      '11340',
      '11341',
      '11342',
      '11343',
      '11344',
      '11345',
      '11346',
      '11347',
      '11348',
      '11349',
      '11350',
      '11351',
      '11352',
      '11353',
      '11354',
      '11355',
      '11356',
      '11357',
      '11358',
      '11359',
      '11360',
      '11361',
      '11362',
      '11363',
      '11364',
      '11365',
      '11366',
      '11367',
      '11368',
      '11369',
      '11370',
      '11371',
      '11372',
      '11373',
      '11374',
      '11375',
      '11376',
      '11377',
      '11378',
      '11379',
      '11380',
      '11381',
      '11382',
      '11383',
      '11384',
      '11385',
      '11386',
      '11387',
      '11388',
      '11389',
      '11390',
      '11391',
      '11392',
      '11393',
      '11394',
      '11395',
      '11396',
      '11397',
      '11398',
      '11399',
      '11400',
      '11401',
      '11402',
      '11403',
      '11404',
      '11405',
      '11406',
      '11407',
      '11408',
      '11409',
      '11410',
      '11411',
      '11412',
      '11413',
      '11414',
      '11415',
      '11416',
      '11417',
      '11418',
      '11419',
      '11420',
      '11421',
      '11422',
      '11423',
      '11424',
      '11425',
      '11426',
      '11427',
      '11428',
      '11429',
      '11430',
      '11431',
      '11432',
      '11433',
      '11434',
      '11435',
      '11436',
      '11437',
      '11438',
      '11439',
      '11440',
      '11441',
      '11442',
      '11443',
      '11444',
      '11445',
      '11446',
      '11447',
      '11448',
      '11449',
      '11450',
      '11451',
      '11452',
      '11453',
      '11454',
      '11455',
      '11456',
      '11457',
      '11458',
      '11459',
      '11460',
      '11461',
      '11462',
      '11463',
      '11464',
      '11465',
      '11466',
      '11467',
      '11468',
      '11469',
      '11470',
      '11471',
      '11472',
      '11473',
      '11474',
      '11475',
      '11476',
      '11477',
      '11478',
      '11479',
      '11480',
      '11481',
      '11482',
      '11483',
      '11484',
      '11485',
      '11486',
      '11487',
      '11488',
      '11489',
      '11490',
      '11491',
      '11492',
      '11493',
      '11494',
      '11495',
      '11496',
      '11497',
      '11498',
      '11499',
      '11500',
      '11501',
      '11502',
      '11503',
      '11504',
      '11505',
      '11506',
      '11507',
      '11508',
      '11509',
      '11510',
      '11511',
      '11512',
      '11513',
      '11514',
      '11515',
      '11516',
      '11517',
      '11518',
      '11519',
      '11520',
      '11521',
      '11522',
      '11523',
      '11524',
      '11525',
      '11526',
      '11527',
      '11528',
      '11529',
      '11530',
      '11531',
      '11532',
      '11533',
      '11534',
      '11535',
      '11536',
      '11537',
      '11538',
      '11539',
      '11540',
      '11541',
      '11542',
      '11543',
      '11544',
      '11545',
      '11546',
      '11547',
      '11548',
      '11549',
      '11550',
      '11551',
      '11552',
      '11553',
      '11554',
      '11555',
      '11556',
      '11557',
      '11558',
      '11559',
      '11560',
      '11561',
      '11562',
      '11563',
      '11564',
      '11565',
      '11566',
      '11567',
      '11568',
      '11569',
      '11570',
      '11571',
      '11572',
      '11573',
      '11574',
      '11575',
      '11576',
      '11577',
      '11578',
      '11579',
      '11580',
      '11581',
      '11582',
      '11583',
      '11584',
      '11585',
      '11586',
      '11587',
      '11588',
      '11589',
      '11590',
      '11591',
      '11592',
      '11593',
      '11594',
      '11595',
      '11596',
      '11597',
      '11598',
      '11599',
      '11600',
      '11601',
      '11602',
      '11603',
      '11604',
      '11605',
      '11606',
      '11607',
      '11608',
      '11609',
      '11610',
      '11611',
      '11612',
      '11613',
      '11614',
      '11615',
      '11616',
      '11617',
      '11618',
      '11619',
      '11620',
      '11621',
      '11622',
      '11623',
      '11624',
      '11625',
      '11626',
      '11627',
      '11628',
      '11629',
      '11630',
      '11631',
      '11632',
      '11633',
      '11634',
      '11635',
      '11636',
      '11637',
      '11638',
      '11639',
      '11640',
      '11641',
      '11642',
      '11643',
      '11644',
      '11645',
      '11646',
      '11647',
      '11648',
    ];

    for (let i = 10626; i < 14233; i++) {
      if (!usedIxcIds.includes(String(i))) {
        ixcIds.push(String(i));
      }
    }

    console.log('IDs:', JSON.stringify(ixcIds));

    switchPage(page1);

    const customersMainIxcPage = new CustomersMainIXCPage();

    await customersMainIxcPage.navigateTo();

    for (const ixcId of ixcIds) {
      usedIxcIds.push(ixcId);

      console.log();
      console.log('USED IDS: ', JSON.stringify(usedIxcIds));
      console.log();

      switchPage(page1);

      const customersDetailsMainIxcPage = new CustomersDetailsMainIXCPage();
      const customersDetailsAddressIxcPage = new CustomersDetailsAddressIXCPage();
      const customersDetailsContactIxcPage = new CustomersDetailsContactIXCPage();
      const customersDetailsFinanceIxcPage = new CustomersDetailsFinanceIXCPage();
      const customersDetailsContractIxcPage = new CustomersDetailsContractIXCPage();

      const ixcCustomer = await customersMainIxcPage.findByField({
        field: 'id',
        value: ixcId,
      });

      if (!ixcCustomer || !ixcCustomer.active) {
        continue;
      }

      await customersDetailsMainIxcPage.open({
        customer_id: ixcCustomer.id,
      });

      const mainDetails = await customersDetailsMainIxcPage.getMainDetails();

      await customersDetailsAddressIxcPage.navigateTo();

      const addressInfo = await customersDetailsAddressIxcPage.getAddressInfo();

      await customersDetailsMainIxcPage.navigateTo();
      await customersDetailsContactIxcPage.navigateTo();

      const contactInfo = await customersDetailsContactIxcPage.getContactInfo();

      await customersDetailsMainIxcPage.navigateTo();
      await customersDetailsFinanceIxcPage.navigateTo();

      const finances = await customersDetailsFinanceIxcPage.getAll();

      await customersDetailsMainIxcPage.navigateTo();
      await customersDetailsContractIxcPage.navigateTo();

      const contracts = await customersDetailsContractIxcPage.getAll();

      await customersDetailsMainIxcPage.navigateTo();

      await customersDetailsMainIxcPage.close();

      const extendedCustomerIxc: IExtendedCustomerIXC = {
        ...ixcCustomer,
        details: {
          main: mainDetails,
          address: addressInfo,
          contact: contactInfo,
          finances,
          contracts,
        },
      };

      console.log();
      console.log('IXC ID:', ixcId);
      console.log(JSON.stringify(extendedCustomerIxc));
      console.log();

      switchPage(page2);

      const contaAzulCustomersMainPage = new ContaAzulCustomersMainPage();

      await contaAzulCustomersMainPage.navigateTo();

      let contaAzulCustomer = await contaAzulCustomersMainPage.findByField({
        field: 'document',
        value: extendedCustomerIxc.document,
      });

      if (!contaAzulCustomer) {
        const contaAzulCustomersCreatePage = new ContaAzulCustomersCreatePage();

        await contaAzulCustomersCreatePage.navigateTo();

        await contaAzulCustomersCreatePage.create({
          person_type: extendedCustomerIxc.details.main.person_type,
          document: extendedCustomerIxc.document,
          name: extendedCustomerIxc.name,
          fantasy_name: extendedCustomerIxc.fantasy_name,
          ixc_id: extendedCustomerIxc.id,
          additional_info: {
            email: extendedCustomerIxc.details.contact.email,
            phone_commercial:
              extendedCustomerIxc.details.contact.phone_commercial,
            phone_mobile: extendedCustomerIxc.details.contact.phone_mobile,
            birth_date: extendedCustomerIxc.details.main.birth_date.toISOString(),
            identity: extendedCustomerIxc.identity,
          },
          address: {
            cep: extendedCustomerIxc.details.address.cep,
            number: extendedCustomerIxc.details.address.number,
            complement: extendedCustomerIxc.details.address.complement,
          },
        });

        if (extendedCustomerIxc.details.main.person_type === 'fisica') {
          contaAzulCustomer = {
            name: extendedCustomerIxc.name,
            document: extendedCustomerIxc.document,
            email: extendedCustomerIxc.details.contact.email,
            phone: extendedCustomerIxc.details.contact.phone_mobile,
            active: true,
          };
        } else if (
          extendedCustomerIxc.details.main.person_type === 'juridica'
        ) {
          contaAzulCustomer = {
            name: extendedCustomerIxc.fantasy_name,
            document: extendedCustomerIxc.document,
            email: extendedCustomerIxc.details.contact.email,
            phone: extendedCustomerIxc.details.contact.phone_mobile,
            active: true,
          };
        }

        const contaAzulContractsCreatePage = new ContaAzulContractsCreatePage();

        for (const contract of extendedCustomerIxc.details.contracts.filter(
          item => item.status,
        )) {
          await contaAzulContractsCreatePage.navigateTo();

          let always_charge_on_day: number;

          if (isBefore(contract.activation_date, new Date(2020, 10, 13))) {
            if (contract.activation_date.getDate() <= 5) {
              always_charge_on_day = 5;
            } else if (contract.activation_date.getDate() >= 6) {
              always_charge_on_day = contract.activation_date.getDate();
            }
          } else if (contract.activation_date.getDate() <= 26) {
            always_charge_on_day = contract.activation_date.getDate();
          } else if (contract.activation_date.getDate() >= 27) {
            always_charge_on_day = 26;
          }

          await contaAzulContractsCreatePage.create({
            document: extendedCustomerIxc.document,
            category: 'Vendas',
            sell_date: setDate(contract.activation_date, {
              date: always_charge_on_day + 1,
            }).toISOString(),
            always_charge_on_day,
            products: formatIxcContractProductsToContaAzul(
              contract.products.items,
            ),
          });
        }
      }

      const contaAzulBillToReceiveMainPage = new ContaAzulBillToReceiveMainPage();

      await contaAzulBillToReceiveMainPage.navigateTo();

      const billsToReceive = await contaAzulBillToReceiveMainPage.findByField({
        field: 'launch.customer_name',
        value: contaAzulCustomer.name,
      });

      const contaAzulBillsToReceiveDetailsPage = new ContaAzulBillsToReceiveDetailsPage();

      for (const billToReceive of billsToReceive) {
        const filterReceivedBills = extendedCustomerIxc.details.finances.filter(
          receivedBill => {
            const dateLessThreeDays = subDays(billToReceive.date, 3);
            const dateMoreThreeDays = addDays(billToReceive.date, 3);

            if (
              billToReceive.value === receivedBill.value &&
              isAfter(receivedBill.due_date, dateLessThreeDays) &&
              isBefore(receivedBill.due_date, dateMoreThreeDays)
            ) {
              return true;
            }

            return false;
          },
        );

        if (filterReceivedBills.length === 0) {
          console.log();
          console.log('Not found any received bills...');
          console.log('Bill To Receive: ', JSON.stringify(billToReceive));
          console.log();

          await api.post('/logs', {
            date: new Date(),
            ixc_id: `${extendedCustomerIxc.id} - ${extendedCustomerIxc.name}`,
            projection_id: billToReceive.sell_id,
            conta_azul_existing: true,
            discharge_performed: false,
          });

          continue;
        }

        if (filterReceivedBills.length > 1) {
          console.log();
          console.log('Found multiple received bills...');
          console.log();

          continue;
        }

        const finance = filterReceivedBills[0];

        if (finance.status !== 'Recebido') {
          continue;
        }

        // console.log('Bill To Receive: ', billToReceive);
        // console.log('IXC Filter Bills To Receive: ', filterReceivedBills);
        // console.log();

        await contaAzulBillsToReceiveDetailsPage.open({
          bill_to_receive_sell_id: billToReceive.sell_id,
        });

        await contaAzulBillsToReceiveDetailsPage.fillData({
          account: 'Sicoob Crediuna',
          received_date: finance.received_date.toISOString(),
          discount: 0,
          interest: Number((finance.paid_value - finance.value).toFixed(2)),
          paid: finance.paid_value,
          transaction_id: finance.id,
          sell_id: finance.sell_id,
        });
      }

      // await page2.driver.reload();
    }

    timer.stop();

    const formattedTimer = timer.format();

    console.log(`\nElapsed time: ${formattedTimer}`);
  }
}
