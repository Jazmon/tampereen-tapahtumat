const applyIfExist = ({ obj, prop, str = '', spacer = '' }) => {
  if (obj && obj.hasOwnProperty(prop) && !!obj[prop]) {
    return `${str}${spacer}${obj[prop]}`;
  }
  return str;
};

export const getAddressFromEvent = (event: Event): string => {
  let address = '';
  const obj = event.contact_info;

  address = applyIfExist({ obj, prop: 'address', str: address, spacer: '' });
  address = applyIfExist({ obj, prop: 'postcode', str: address, spacer: ' ' });
  // address = applyIfExist({ obj, prop: 'city', str: address, spacer: ' ' });
  address += ', Tampere';
  // address = applyIfExist({ obj, prop: 'country', str: address, spacer: ' ' });
  return address;
};
