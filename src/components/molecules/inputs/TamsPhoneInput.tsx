'use client'

import { useEffect, useMemo, useState } from 'react'
import { Combobox, useCombobox, ScrollArea } from '@mantine/core'

interface Country {
  name: string
  iso2: string
  dialCode: string
}

const countries: Country[] = [
  {
    iso2: 'AF',
    name: 'Afghanistan',
    dialCode: '+93',
  },
  {
    iso2: 'AL',
    name: 'Albania',
    dialCode: '+355',
  },
  {
    iso2: 'DZ',
    name: 'Algeria',
    dialCode: '+213',
  },
  {
    iso2: 'AS',
    name: 'American Samoa',
    dialCode: '+1684',
  },
  {
    iso2: 'AD',
    name: 'Andorra',
    dialCode: '+376',
  },
  {
    iso2: 'AO',
    name: 'Angola',
    dialCode: '+244',
  },
  {
    iso2: 'AI',
    name: 'Anguilla',
    dialCode: '+1264',
  },
  {
    iso2: 'AQ',
    name: 'Antarctica',
    dialCode: '+0',
  },
  {
    iso2: 'AG',
    name: 'Antigua And Barbuda',
    dialCode: '+1268',
  },
  {
    iso2: 'AR',
    name: 'Argentina',
    dialCode: '+54',
  },
  {
    iso2: 'AM',
    name: 'Armenia',
    dialCode: '+374',
  },
  {
    iso2: 'AW',
    name: 'Aruba',
    dialCode: '+297',
  },
  {
    iso2: 'AU',
    name: 'Australia',
    dialCode: '+61',
  },
  {
    iso2: 'AT',
    name: 'Austria',
    dialCode: '+43',
  },
  {
    iso2: 'AZ',
    name: 'Azerbaijan',
    dialCode: '+994',
  },
  {
    iso2: 'BS',
    name: 'Bahamas The',
    dialCode: '+1242',
  },
  {
    iso2: 'BH',
    name: 'Bahrain',
    dialCode: '+973',
  },
  {
    iso2: 'BD',
    name: 'Bangladesh',
    dialCode: '+880',
  },
  {
    iso2: 'BB',
    name: 'Barbados',
    dialCode: '+1246',
  },
  {
    iso2: 'BY',
    name: 'Belarus',
    dialCode: '+375',
  },
  {
    iso2: 'BE',
    name: 'Belgium',
    dialCode: '+32',
  },
  {
    iso2: 'BZ',
    name: 'Belize',
    dialCode: '+501',
  },
  {
    iso2: 'BJ',
    name: 'Benin',
    dialCode: '+229',
  },
  {
    iso2: 'BM',
    name: 'Bermuda',
    dialCode: '+1441',
  },
  {
    iso2: 'BT',
    name: 'Bhutan',
    dialCode: '+975',
  },
  {
    iso2: 'BO',
    name: 'Bolivia',
    dialCode: '+591',
  },
  {
    iso2: 'BA',
    name: 'Bosnia and Herzegovina',
    dialCode: '+387',
  },
  {
    iso2: 'BW',
    name: 'Botswana',
    dialCode: '+267',
  },
  {
    iso2: 'BV',
    name: 'Bouvet Island',
    dialCode: '+0',
  },
  {
    iso2: 'BR',
    name: 'Brazil',
    dialCode: '+55',
  },
  {
    iso2: 'IO',
    name: 'British Indian Ocean Territory',
    dialCode: '+246',
  },
  {
    iso2: 'BN',
    name: 'Brunei',
    dialCode: '+673',
  },
  {
    iso2: 'BG',
    name: 'Bulgaria',
    dialCode: '+359',
  },
  {
    iso2: 'BF',
    name: 'Burkina Faso',
    dialCode: '+226',
  },
  {
    iso2: 'BI',
    name: 'Burundi',
    dialCode: '+257',
  },
  {
    iso2: 'KH',
    name: 'Cambodia',
    dialCode: '+855',
  },
  {
    iso2: 'CM',
    name: 'Cameroon',
    dialCode: '+237',
  },
  {
    iso2: 'CA',
    name: 'Canada',
    dialCode: '+1',
  },
  {
    iso2: 'CV',
    name: 'Cape Verde',
    dialCode: '+238',
  },
  {
    iso2: 'KY',
    name: 'Cayman Islands',
    dialCode: '+1345',
  },
  {
    iso2: 'CF',
    name: 'Central African Republic',
    dialCode: '+236',
  },
  {
    iso2: 'TD',
    name: 'Chad',
    dialCode: '+235',
  },
  {
    iso2: 'CL',
    name: 'Chile',
    dialCode: '+56',
  },
  {
    iso2: 'CN',
    name: 'China',
    dialCode: '+86',
  },
  {
    iso2: 'CX',
    name: 'Christmas Island',
    dialCode: '+61',
  },
  {
    iso2: 'CC',
    name: 'Cocos (Keeling) Islands',
    dialCode: '+672',
  },
  {
    iso2: 'CO',
    name: 'Colombia',
    dialCode: '+57',
  },
  {
    iso2: 'KM',
    name: 'Comoros',
    dialCode: '+269',
  },
  {
    iso2: 'CG',
    name: 'Congo',
    dialCode: '+242',
  },
  {
    iso2: 'CD',
    name: 'Congo The Democratic Republic Of The',
    dialCode: '+242',
  },
  {
    iso2: 'CK',
    name: 'Cook Islands',
    dialCode: '+682',
  },
  {
    iso2: 'CR',
    name: 'Costa Rica',
    dialCode: '+506',
  },
  {
    iso2: 'CI',
    name: 'Cote D Ivoire (Ivory Coast)',
    dialCode: '+225',
  },
  {
    iso2: 'HR',
    name: 'Croatia (Hrvatska)',
    dialCode: '+385',
  },
  {
    iso2: 'CU',
    name: 'Cuba',
    dialCode: '+53',
  },
  {
    iso2: 'CY',
    name: 'Cyprus',
    dialCode: '+357',
  },
  {
    iso2: 'CZ',
    name: 'Czech Republic',
    dialCode: '+420',
  },
  {
    iso2: 'DK',
    name: 'Denmark',
    dialCode: '+45',
  },
  {
    iso2: 'DJ',
    name: 'Djibouti',
    dialCode: '+253',
  },
  {
    iso2: 'DM',
    name: 'Dominica',
    dialCode: '+1767',
  },
  {
    iso2: 'DO',
    name: 'Dominican Republic',
    dialCode: '+1809',
  },
  {
    iso2: 'TP',
    name: 'East Timor',
    dialCode: '+670',
  },
  {
    iso2: 'EC',
    name: 'Ecuador',
    dialCode: '+593',
  },
  {
    iso2: 'EG',
    name: 'Egypt',
    dialCode: '+20',
  },
  {
    iso2: 'SV',
    name: 'El Salvador',
    dialCode: '+503',
  },
  {
    iso2: 'GQ',
    name: 'Equatorial Guinea',
    dialCode: '+240',
  },
  {
    iso2: 'ER',
    name: 'Eritrea',
    dialCode: '+291',
  },
  {
    iso2: 'EE',
    name: 'Estonia',
    dialCode: '+372',
  },
  {
    iso2: 'ET',
    name: 'Ethiopia',
    dialCode: '+251',
  },
  {
    iso2: 'XA',
    name: 'External Territories of Australia',
    dialCode: '+61',
  },
  {
    iso2: 'FK',
    name: 'Falkland Islands',
    dialCode: '+500',
  },
  {
    iso2: 'FO',
    name: 'Faroe Islands',
    dialCode: '+298',
  },
  {
    iso2: 'FJ',
    name: 'Fiji Islands',
    dialCode: '+679',
  },
  {
    iso2: 'FI',
    name: 'Finland',
    dialCode: '+358',
  },
  {
    iso2: 'FR',
    name: 'France',
    dialCode: '+33',
  },
  {
    iso2: 'GF',
    name: 'French Guiana',
    dialCode: '+594',
  },
  {
    iso2: 'PF',
    name: 'French Polynesia',
    dialCode: '+689',
  },
  {
    iso2: 'TF',
    name: 'French Southern Territories',
    dialCode: '+0',
  },
  {
    iso2: 'GA',
    name: 'Gabon',
    dialCode: '+241',
  },
  {
    iso2: 'GM',
    name: 'Gambia The',
    dialCode: '+220',
  },
  {
    iso2: 'GE',
    name: 'Georgia',
    dialCode: '+995',
  },
  {
    iso2: 'DE',
    name: 'Germany',
    dialCode: '+49',
  },
  {
    iso2: 'GH',
    name: 'Ghana',
    dialCode: '+233',
  },
  {
    iso2: 'GI',
    name: 'Gibraltar',
    dialCode: '+350',
  },
  {
    iso2: 'GR',
    name: 'Greece',
    dialCode: '+30',
  },
  {
    iso2: 'GL',
    name: 'Greenland',
    dialCode: '+299',
  },
  {
    iso2: 'GD',
    name: 'Grenada',
    dialCode: '+1473',
  },
  {
    iso2: 'GP',
    name: 'Guadeloupe',
    dialCode: '+590',
  },
  {
    iso2: 'GU',
    name: 'Guam',
    dialCode: '+1671',
  },
  {
    iso2: 'GT',
    name: 'Guatemala',
    dialCode: '+502',
  },
  {
    iso2: 'XU',
    name: 'Guernsey and Alderney',
    dialCode: '+44',
  },
  {
    iso2: 'GN',
    name: 'Guinea',
    dialCode: '+224',
  },
  {
    iso2: 'GW',
    name: 'Guinea-Bissau',
    dialCode: '+245',
  },
  {
    iso2: 'GY',
    name: 'Guyana',
    dialCode: '+592',
  },
  {
    iso2: 'HT',
    name: 'Haiti',
    dialCode: '+509',
  },
  {
    iso2: 'HM',
    name: 'Heard and McDonald Islands',
    dialCode: '+0',
  },
  {
    iso2: 'HN',
    name: 'Honduras',
    dialCode: '+504',
  },
  {
    iso2: 'HK',
    name: 'Hong Kong S.A.R.',
    dialCode: '+852',
  },
  {
    iso2: 'HU',
    name: 'Hungary',
    dialCode: '+36',
  },
  {
    iso2: 'IS',
    name: 'Iceland',
    dialCode: '+354',
  },
  {
    iso2: 'IN',
    name: 'India',
    dialCode: '+91',
  },
  {
    iso2: 'ID',
    name: 'Indonesia',
    dialCode: '+62',
  },
  {
    iso2: 'IR',
    name: 'Iran',
    dialCode: '+98',
  },
  {
    iso2: 'IQ',
    name: 'Iraq',
    dialCode: '+964',
  },
  {
    iso2: 'IE',
    name: 'Ireland',
    dialCode: '+353',
  },
  {
    iso2: 'IL',
    name: 'Israel',
    dialCode: '+972',
  },
  {
    iso2: 'IT',
    name: 'Italy',
    dialCode: '+39',
  },
  {
    iso2: 'JM',
    name: 'Jamaica',
    dialCode: '+1876',
  },
  {
    iso2: 'JP',
    name: 'Japan',
    dialCode: '+81',
  },
  {
    iso2: 'XJ',
    name: 'Jersey',
    dialCode: '+44',
  },
  {
    iso2: 'JO',
    name: 'Jordan',
    dialCode: '+962',
  },
  {
    iso2: 'KZ',
    name: 'Kazakhstan',
    dialCode: '+7',
  },
  {
    iso2: 'KE',
    name: 'Kenya',
    dialCode: '+254',
  },
  {
    iso2: 'KI',
    name: 'Kiribati',
    dialCode: '+686',
  },
  {
    iso2: 'KP',
    name: 'Korea North',
    dialCode: '+850',
  },
  {
    iso2: 'KR',
    name: 'Korea South',
    dialCode: '+82',
  },
  {
    iso2: 'KW',
    name: 'Kuwait',
    dialCode: '+965',
  },
  {
    iso2: 'KG',
    name: 'Kyrgyzstan',
    dialCode: '+996',
  },
  {
    iso2: 'LA',
    name: 'Laos',
    dialCode: '+856',
  },
  {
    iso2: 'LV',
    name: 'Latvia',
    dialCode: '+371',
  },
  {
    iso2: 'LB',
    name: 'Lebanon',
    dialCode: '+961',
  },
  {
    iso2: 'LS',
    name: 'Lesotho',
    dialCode: '+266',
  },
  {
    iso2: 'LR',
    name: 'Liberia',
    dialCode: '+231',
  },
  {
    iso2: 'LY',
    name: 'Libya',
    dialCode: '+218',
  },
  {
    iso2: 'LI',
    name: 'Liechtenstein',
    dialCode: '+423',
  },
  {
    iso2: 'LT',
    name: 'Lithuania',
    dialCode: '+370',
  },
  {
    iso2: 'LU',
    name: 'Luxembourg',
    dialCode: '+352',
  },
  {
    iso2: 'MO',
    name: 'Macau S.A.R.',
    dialCode: '+853',
  },
  {
    iso2: 'MK',
    name: 'Macedonia',
    dialCode: '+389',
  },
  {
    iso2: 'MG',
    name: 'Madagascar',
    dialCode: '+261',
  },
  {
    iso2: 'MW',
    name: 'Malawi',
    dialCode: '+265',
  },
  {
    iso2: 'MY',
    name: 'Malaysia',
    dialCode: '+60',
  },
  {
    iso2: 'MV',
    name: 'Maldives',
    dialCode: '+960',
  },
  {
    iso2: 'ML',
    name: 'Mali',
    dialCode: '+223',
  },
  {
    iso2: 'MT',
    name: 'Malta',
    dialCode: '+356',
  },
  {
    iso2: 'XM',
    name: 'Man (Isle of)',
    dialCode: '+44',
  },
  {
    iso2: 'MH',
    name: 'Marshall Islands',
    dialCode: '+692',
  },
  {
    iso2: 'MQ',
    name: 'Martinique',
    dialCode: '+596',
  },
  {
    iso2: 'MR',
    name: 'Mauritania',
    dialCode: '+222',
  },
  {
    iso2: 'MU',
    name: 'Mauritius',
    dialCode: '+230',
  },
  {
    iso2: 'YT',
    name: 'Mayotte',
    dialCode: '+269',
  },
  {
    iso2: 'MX',
    name: 'Mexico',
    dialCode: '+52',
  },
  {
    iso2: 'FM',
    name: 'Micronesia',
    dialCode: '+691',
  },
  {
    iso2: 'MD',
    name: 'Moldova',
    dialCode: '+373',
  },
  {
    iso2: 'MC',
    name: 'Monaco',
    dialCode: '+377',
  },
  {
    iso2: 'MN',
    name: 'Mongolia',
    dialCode: '+976',
  },
  {
    iso2: 'MS',
    name: 'Montserrat',
    dialCode: '+1664',
  },
  {
    iso2: 'MA',
    name: 'Morocco',
    dialCode: '+212',
  },
  {
    iso2: 'MZ',
    name: 'Mozambique',
    dialCode: '+258',
  },
  {
    iso2: 'MM',
    name: 'Myanmar',
    dialCode: '+95',
  },
  {
    iso2: 'NA',
    name: 'Namibia',
    dialCode: '+264',
  },
  {
    iso2: 'NR',
    name: 'Nauru',
    dialCode: '+674',
  },
  {
    iso2: 'NP',
    name: 'Nepal',
    dialCode: '+977',
  },
  {
    iso2: 'AN',
    name: 'Netherlands Antilles',
    dialCode: '+599',
  },
  {
    iso2: 'NL',
    name: 'Netherlands The',
    dialCode: '+31',
  },
  {
    iso2: 'NC',
    name: 'New Caledonia',
    dialCode: '+687',
  },
  {
    iso2: 'NZ',
    name: 'New Zealand',
    dialCode: '+64',
  },
  {
    iso2: 'NI',
    name: 'Nicaragua',
    dialCode: '+505',
  },
  {
    iso2: 'NE',
    name: 'Niger',
    dialCode: '+227',
  },
  {
    iso2: 'NG',
    name: 'Nigeria',
    dialCode: '+234',
  },
  {
    iso2: 'NU',
    name: 'Niue',
    dialCode: '+683',
  },
  {
    iso2: 'NF',
    name: 'Norfolk Island',
    dialCode: '+672',
  },
  {
    iso2: 'MP',
    name: 'Northern Mariana Islands',
    dialCode: '+1670',
  },
  {
    iso2: 'NO',
    name: 'Norway',
    dialCode: '+47',
  },
  {
    iso2: 'OM',
    name: 'Oman',
    dialCode: '+968',
  },
  {
    iso2: 'PK',
    name: 'Pakistan',
    dialCode: '+92',
  },
  {
    iso2: 'PW',
    name: 'Palau',
    dialCode: '+680',
  },
  {
    iso2: 'PS',
    name: 'Palestinian Territory Occupied',
    dialCode: '+970',
  },
  {
    iso2: 'PA',
    name: 'Panama',
    dialCode: '+507',
  },
  {
    iso2: 'PG',
    name: 'Papua new Guinea',
    dialCode: '+675',
  },
  {
    iso2: 'PY',
    name: 'Paraguay',
    dialCode: '+595',
  },
  {
    iso2: 'PE',
    name: 'Peru',
    dialCode: '+51',
  },
  {
    iso2: 'PH',
    name: 'Philippines',
    dialCode: '+63',
  },
  {
    iso2: 'PN',
    name: 'Pitcairn Island',
    dialCode: '+0',
  },
  {
    iso2: 'PL',
    name: 'Poland',
    dialCode: '+48',
  },
  {
    iso2: 'PT',
    name: 'Portugal',
    dialCode: '+351',
  },
  {
    iso2: 'PR',
    name: 'Puerto Rico',
    dialCode: '+1787',
  },
  {
    iso2: 'QA',
    name: 'Qatar',
    dialCode: '+974',
  },
  {
    iso2: 'RE',
    name: 'Reunion',
    dialCode: '+262',
  },
  {
    iso2: 'RO',
    name: 'Romania',
    dialCode: '+40',
  },
  {
    iso2: 'RU',
    name: 'Russia',
    dialCode: '+70',
  },
  {
    iso2: 'RW',
    name: 'Rwanda',
    dialCode: '+250',
  },
  {
    iso2: 'SH',
    name: 'Saint Helena',
    dialCode: '+290',
  },
  {
    iso2: 'KN',
    name: 'Saint Kitts And Nevis',
    dialCode: '+1869',
  },
  {
    iso2: 'LC',
    name: 'Saint Lucia',
    dialCode: '+1758',
  },
  {
    iso2: 'PM',
    name: 'Saint Pierre and Miquelon',
    dialCode: '+508',
  },
  {
    iso2: 'VC',
    name: 'Saint Vincent And The Grenadines',
    dialCode: '+1784',
  },
  {
    iso2: 'WS',
    name: 'Samoa',
    dialCode: '+684',
  },
  {
    iso2: 'SM',
    name: 'San Marino',
    dialCode: '+378',
  },
  {
    iso2: 'ST',
    name: 'Sao Tome and Principe',
    dialCode: '+239',
  },
  {
    iso2: 'SA',
    name: 'Saudi Arabia',
    dialCode: '+966',
  },
  {
    iso2: 'SN',
    name: 'Senegal',
    dialCode: '+221',
  },
  {
    iso2: 'RS',
    name: 'Serbia',
    dialCode: '+381',
  },
  {
    iso2: 'SC',
    name: 'Seychelles',
    dialCode: '+248',
  },
  {
    iso2: 'SL',
    name: 'Sierra Leone',
    dialCode: '+232',
  },
  {
    iso2: 'SG',
    name: 'Singapore',
    dialCode: '+65',
  },
  {
    iso2: 'SK',
    name: 'Slovakia',
    dialCode: '+421',
  },
  {
    iso2: 'SI',
    name: 'Slovenia',
    dialCode: '+386',
  },
  {
    iso2: 'XG',
    name: 'Smaller Territories of the UK',
    dialCode: '+44',
  },
  {
    iso2: 'SB',
    name: 'Solomon Islands',
    dialCode: '+677',
  },
  {
    iso2: 'SO',
    name: 'Somalia',
    dialCode: '+252',
  },
  {
    iso2: 'ZA',
    name: 'South Africa',
    dialCode: '+27',
  },
  {
    iso2: 'GS',
    name: 'South Georgia',
    dialCode: '+0',
  },
  {
    iso2: 'SS',
    name: 'South Sudan',
    dialCode: '+211',
  },
  {
    iso2: 'ES',
    name: 'Spain',
    dialCode: '+34',
  },
  {
    iso2: 'LK',
    name: 'Sri Lanka',
    dialCode: '+94',
  },
  {
    iso2: 'SD',
    name: 'Sudan',
    dialCode: '+249',
  },
  {
    iso2: 'SR',
    name: 'Suriname',
    dialCode: '+597',
  },
  {
    iso2: 'SJ',
    name: 'Svalbard And Jan Mayen Islands',
    dialCode: '+47',
  },
  {
    iso2: 'SZ',
    name: 'Swaziland',
    dialCode: '+268',
  },
  {
    iso2: 'SE',
    name: 'Sweden',
    dialCode: '+46',
  },
  {
    iso2: 'CH',
    name: 'Switzerland',
    dialCode: '+41',
  },
  {
    iso2: 'SY',
    name: 'Syria',
    dialCode: '+963',
  },
  {
    iso2: 'TW',
    name: 'Taiwan',
    dialCode: '+886',
  },
  {
    iso2: 'TJ',
    name: 'Tajikistan',
    dialCode: '+992',
  },
  {
    iso2: 'TZ',
    name: 'Tanzania',
    dialCode: '+255',
  },
  {
    iso2: 'TH',
    name: 'Thailand',
    dialCode: '+66',
  },
  {
    iso2: 'TG',
    name: 'Togo',
    dialCode: '+228',
  },
  {
    iso2: 'TK',
    name: 'Tokelau',
    dialCode: '+690',
  },
  {
    iso2: 'TO',
    name: 'Tonga',
    dialCode: '+676',
  },
  {
    iso2: 'TT',
    name: 'Trinidad And Tobago',
    dialCode: '+1868',
  },
  {
    iso2: 'TN',
    name: 'Tunisia',
    dialCode: '+216',
  },
  {
    iso2: 'TR',
    name: 'Turkey',
    dialCode: '+90',
  },
  {
    iso2: 'TM',
    name: 'Turkmenistan',
    dialCode: '+7370',
  },
  {
    iso2: 'TC',
    name: 'Turks And Caicos Islands',
    dialCode: '+1649',
  },
  {
    iso2: 'TV',
    name: 'Tuvalu',
    dialCode: '+688',
  },
  {
    iso2: 'UG',
    name: 'Uganda',
    dialCode: '+256',
  },
  {
    iso2: 'UA',
    name: 'Ukraine',
    dialCode: '+380',
  },
  {
    iso2: 'AE',
    name: 'United Arab Emirates',
    dialCode: '+971',
  },
  {
    iso2: 'GB',
    name: 'United Kingdom',
    dialCode: '+44',
  },
  {
    iso2: 'US',
    name: 'United States',
    dialCode: '+1',
  },
  {
    iso2: 'UM',
    name: 'United States Minor Outlying Islands',
    dialCode: '+1',
  },
  {
    iso2: 'UY',
    name: 'Uruguay',
    dialCode: '+598',
  },
  {
    iso2: 'UZ',
    name: 'Uzbekistan',
    dialCode: '+998',
  },
  {
    iso2: 'VU',
    name: 'Vanuatu',
    dialCode: '+678',
  },
  {
    iso2: 'VA',
    name: 'Vatican City State (Holy See)',
    dialCode: '+39',
  },
  {
    iso2: 'VE',
    name: 'Venezuela',
    dialCode: '+58',
  },
  {
    iso2: 'VN',
    name: 'Vietnam',
    dialCode: '+84',
  },
  {
    iso2: 'VG',
    name: 'Virgin Islands (British)',
    dialCode: '+1284',
  },
  {
    iso2: 'VI',
    name: 'Virgin Islands (US)',
    dialCode: '+1340',
  },
  {
    iso2: 'WF',
    name: 'Wallis And Futuna Islands',
    dialCode: '+681',
  },
  {
    iso2: 'EH',
    name: 'Western Sahara',
    dialCode: '+212',
  },
  {
    iso2: 'YE',
    name: 'Yemen',
    dialCode: '+967',
  },
  {
    iso2: 'YU',
    name: 'Yugoslavia',
    dialCode: '+38',
  },
  {
    iso2: 'ZM',
    name: 'Zambia',
    dialCode: '+260',
  },
  {
    iso2: 'ZW',
    name: 'Zimbabwe',
    dialCode: '+263',
  },
]

// Converts an ISO 3166-1 alpha-2 code to its flag emoji via regional indicator symbols
function flagFromIso(iso2: string) {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

interface PhoneNumberInputProps {
  label?: string
  placeholder?: string
  defaultCountry?: string // ISO2, e.g. "NG"
  value?: string // national number, no dial code
  onChange?: (fullNumber: string, country: Country) => void
  error?: string
  disabled?: boolean
  withAsterisk?: boolean
}

export default function TamsPhoneInput({
  label = 'Phone number',
  placeholder = 'Enter phone number',
  defaultCountry = 'NG',
  value,
  onChange,
  withAsterisk,
  error,
  disabled = false,
}: PhoneNumberInputProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  const [search, setSearch] = useState('')
  const [country, setCountry] = useState<Country>(
    () => countries.find((c) => c.iso2 === defaultCountry) ?? countries[0],
  )
  const [number, setNumber] = useState<string>()
  useEffect(() => {
    if (!value) {
      setNumber('')
      return
    }

    const normalizedValue = value.replace(
      new RegExp(`^\\${country.dialCode}`),
      '',
    )
    if (normalizedValue !== number) {
      setNumber(normalizedValue)
    }
  }, [value, country.dialCode])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return countries
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dialCode.includes(q),
    )
  }, [search])

  const handleSelectCountry = (iso2: string) => {
    const next = countries.find((c) => c.iso2 === iso2)
    if (next) {
      setCountry(next)
      onChange?.(`${next.dialCode}${number}`, next)
    }
    combobox.closeDropdown()
    setSearch('')
  }

  const handleNumberChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d\s]/g, '')
    setNumber(cleaned)
    onChange?.(`${country.dialCode}${cleaned}`, country)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-800">
          {label} {withAsterisk && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex w-full">
        <Combobox
          store={combobox}
          width={270}
          position="bottom-start"
          withinPortal={false}
          onOptionSubmit={handleSelectCountry}
        >
          <Combobox.Target>
            <button
              type="button"
              disabled={disabled}
              onClick={() => combobox.toggleDropdown()}
              className="flex h-10.5 shrink-0 items-center gap-1.5 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="text-lg leading-none">
                {flagFromIso(country.iso2)}
              </span>
              <span className="font-medium">{country.dialCode}</span>
              <svg
                className="h-3.5 w-3.5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Search
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Search country or code"
            />
            <Combobox.Options>
              <ScrollArea.Autosize mah={220} type="scroll">
                {filtered.length === 0 ? (
                  <Combobox.Empty>No countries found</Combobox.Empty>
                ) : (
                  filtered.map((c) => (
                    <Combobox.Option value={c.iso2} key={c.iso2}>
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">
                          {flagFromIso(c.iso2)}
                        </span>
                        <span className="flex-1 text-sm">{c.name}</span>
                        <span className="text-xs text-gray-500">
                          {c.dialCode}
                        </span>
                      </div>
                    </Combobox.Option>
                  ))
                )}
              </ScrollArea.Autosize>
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

        <input
          type="tel"
          inputMode="tel"
          value={number}
          disabled={disabled}
          onChange={(event) => handleNumberChange(event.target.value)}
          placeholder={placeholder}
          className="h-10.5 w-full flex-1 rounded-r-md border border-gray-300 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
