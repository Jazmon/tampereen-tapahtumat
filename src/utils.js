// @flow

type AIEType = {
  obj: Object;
  prop: string;
  str: string;
  spacer: string;
};

// If object has a property, append string with it using a spacer
export const applyIfExist = ({ obj, prop, str = '', spacer = '' }: AIEType): string => {
  if (obj && {}.hasOwnProperty.call(obj, prop) && !!obj[prop]) {
    return `${str}${spacer}${obj[prop]}`;
  }
  return str;
};

// parses the address from the event's contact info
export const getAddressFromEvent = (event: VTEvent): string => {
  let address: string = '';
  const obj: VTContactInfo = event.contact_info;

  address = applyIfExist({ obj, prop: 'address', str: address, spacer: '' });
  address = applyIfExist({ obj, prop: 'postcode', str: address, spacer: ' ' });
  address += ', Tampere';
  // NOTE sometimes the api doesn't specify the city, so the above is used..
  // address = applyIfExist({ obj, prop: 'city', str: address, spacer: ' ' });
  // address = applyIfExist({ obj, prop: 'country', str: address, spacer: ' ' });
  return address;
};
