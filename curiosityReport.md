# Status Pages

## Research/Background
Something that many websites and companies will do to communicate with their customers and audience is to create a dashboard or page that reports on the status of a website. These pages have indicators that will display and report on the time the site is up and occasionally other information that may be useful or handy for users of the site to know.

There are many reasons to have a status page for users to see and interact with. One primary reason is that public status pages help to build and foster trust between users and developers. The users feel more informed on what issues may be occurring within the system. These pages are also a convenient way for developers to communicate with their users on a mass scale when issue occur as well. Status pages also boost productivity and help developers stay more accountable to maintaining and fixing issues on a website. Furthermore, a robust and informative status page can reduce support workload by reducing the number of users reporting issues with a service as the user will be able to check the status for themselves.

From my research I found that there were several best practices and things to do and have for these status reports. Some of the best practices mentioned included the following:
- **Transparent and Timely:** The status page should quickly report on issues and be clear about what they are.
- **Use Understable Language:** The reports should describe the status and issues in terms any user could understand and not be convuluted with technical jargon.
- **Keep a History:** There should be history of previous data about the runtime and other issues.
- **Visual Aids:** The status page should include visuals to help demonstrate information.

This topic was interesting to me because I have actually ended up using pages like this when websites I was using went down. When I was using those pages, while I was glad to have a resource showing me that the issue was with the site (and not something with my internet) and that the issue was being worked on, I wished I had been able to know a bit more about why the issue was possibly occurring. When I first heard about this topic in class I reflected on this experience and was interested to learn more about how these status pages worked.

### Sources and Resources

[Status reporting](https://github.com/devops329/devops/blob/main/instruction/statusReporting/statusReporting.md)

[Reporting on Systems: Best Practices and Examples](https://uptime.com/blog/reporting-on-systems-best-practices-and-examples)

[Best Practices for Public Status Pages](https://www.supermonitoring.com/blog/best-practices-for-public-status-pages/)

[The Ultimate Guide to Status Pages: Benefits, Tools, and Best Practices](https://www.hostko.com/blog/network/the-ultimate-guide-to-status-pages-benefits-tools-and-best-practices/)

## Experimentation
There are tons of different software and methods already developed to create a status display for users. A resource I looked at when I was first starting to look into this was this repository called [Awesome status pages](https://github.com/ivbeg/awesome-status-pages?tab=readme-ov-file) that had many resources.

I looked into a few including [Cachet](https://cachethq.io/), [OneUptime](https://oneuptime.com/product/status-page), [aPulse](https://github.com/ybouane/aPulse), [Fettle](https://github.com/mehatab/fettle), [GitHub Status Page](https://github.com/Bullrich/Status-Page), and [Upptime](https://github.com/upptime/upptime) as all of these were free and open source options. They all had decent graphic reporting systems and simple to implement and make public for users.

I eventually decided that I wanted to try implementing [Upptime](https://github.com/upptime/upptime) because it seemed like it was the right balance of free, simple, but actually informative as a status page that would be useful for users.

I read through some of the documentationa and isntructions on how to set up and use Upptime with my JWT Pizza. Following those instructions, I was able to create a repository and I only needed to edit some configuration files and I was then able to have a status page for my JWT Pizza site, which was really cool!

[My JWT Upptime Repository](https://github.com/ZonkeyZebra/jwt-upptime)

[JWT Pizza Status](https://zonkeyzebra.github.io/jwt-upptime/)

Fine-tuning this page so that it could have everything that users may want to see and keeping aware of issues and reporting on them would definitely take more effort, and I could see how useful it would be to come up with systems to manage situations like that beforehand. But, it was nice to see how quickly something like this could be set up and have such a large benefit to users of the JWT Pizza website.

## Conclusion
Communicating a site's status with users is incredibly important and useful. It keeps everyone aware of issues and keeps us accountable, making it very useful to know for DevOps. It's something that is fairly simple to start, though takes a decent amount of effort to maintain and improve. Status pages are very helpful and improves the experiences of both users and developers when working with software.