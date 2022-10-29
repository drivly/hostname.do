export default {
  fetch: async (req, env) => {
    const { user, redirect, body } = await env.CTX.fetch(req).then(res => res.json())
    const { origin, hostname, pathname } = new URL(req.url)
    const domain = pathname.replace('/', '').replace(':domain','example.com') ?? 'example.com'
    console.log(domain)
    const data = await Promise.all([
      fetch('https://cloudflare-dns.com/dns-query?type=NS&name=' + domain, { headers: { accept: 'application/dns-json' } }).then((res) => res.json()),
      fetch('https://cloudflare-dns.com/dns-query?type=A&name=' + domain, { headers: { accept: 'application/dns-json' } }).then((res) => res.json()),
      fetch('https://cloudflare-dns.com/dns-query?type=AAAA&name=' + domain, { headers: { accept: 'application/dns-json' } }).then((res) => res.json()),
      fetch('https://cloudflare-dns.com/dns-query?type=CNAME&name=' + domain, { headers: { accept: 'application/dns-json' } }).then((res) => res.json()),
      fetch('https://cloudflare-dns.com/dns-query?type=MX&name=' + domain, { headers: { accept: 'application/dns-json' } }).then((res) => res.json()),
      fetch('https://cloudflare-dns.com/dns-query?type=SOA&name=' + domain, { headers: { accept: 'application/dns-json' } }).then((res) => res.json()),
      fetch('https://cloudflare-dns.com/dns-query?type=TXT&name=' + domain, { headers: { accept: 'application/dns-json' } }).then((res) => res.json()),
      fetch('https://cloudflare-dns.com/dns-query?type=PTR&name=' + domain, { headers: { accept: 'application/dns-json' } }).then((res) => res.json()),
      fetch('https://cloudflare-dns.com/dns-query?type=SRV&name=' + domain, { headers: { accept: 'application/dns-json' } }).then((res) => res.json()),
      fetch('https://cloudflare-dns.com/dns-query?type=CERT&name=' + domain, { headers: { accept: 'application/dns-json' } }).then((res) => res.json()),
      fetch('https://cloudflare-dns.com/dns-query?type=DCHID&name=' + domain, { headers: { accept: 'application/dns-json' } }).then((res) => res.json()),
      fetch('https://cloudflare-dns.com/dns-query?type=DNAME&name=' + domain, { headers: { accept: 'application/dns-json' } }).then((res) => res.json()),
    ])
    
    const available = data[0].Answer ? undefined : await fetch(env.AVAILABLE_URL + domain, { headers: { accept: 'application/dns-json' } }).then((res) => res.text()).then(val => val.split('\n')[].split(':')[1])
          
    return new Response(JSON.stringify({ 
      api: {
        icon: '🔎',
        name: 'hostname.do',
        description: 'Hostname DNS API',
        url: 'https://hostname.do',
        api: 'https://hostname.do/api',
        endpoints: {
          dns: 'https://hostname.do/:domain',
        },
        type: 'https://apis.do/data',
        repo: 'https://github.com/drivly/hostname.do',
      },
      dns: {
        domain,
        url: 'https://' + domain,
        available,
        NS: data[0].Answer?.map(({data}) => data), 
        A: data[1].Answer?.map(({data}) => data), 
        AAAA: data[2].Answer?.map(({data}) => data), 
        CNAME: data[3].Answer?.map(({data}) => data), 
        MX: data[4].Answer?.map(({data}) => data),
        SOA: data[5].Answer?.map(({data}) => data),
        TXT: data[6].Answer?.map(({data}) => data),
        PTR: data[7].Answer?.map(({data}) => data),
        SRV: data[8].Answer?.map(({data}) => data),
        CERT: data[9].Answer?.map(({data}) => data),
        DCHID: data[10].Answer?.map(({data}) => data),
        DNAME: data[11].Answer?.map(({data}) => data),
      },
      user,
    }, null, 2))
  }
}
