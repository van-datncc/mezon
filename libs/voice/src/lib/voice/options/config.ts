const domain = "meet.mezon.vn";
const options = {    
    hosts: {
      domain: domain,
      muc: `conference.${domain}`,
      focus: `focus.${domain}`
    },
    serviceUrl: `https://${domain}/http-bind?room=`,
};

export default options