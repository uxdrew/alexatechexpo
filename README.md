## Using Elastic Beanstalk to host the website

Install [awscli](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)

Note if installing on windows that the latest version of python is incompatible with awscli, be sure to use the version in the article.

To deploy this website run `eb deploy`. See the `config.yml` file in `/website/.elacticbeanstalk` for config details.

### To create a new Elastic Beanstalk site using `eb`:

Navigate or create a folder that will house the website and navigate there in your CLI of choice

`eb init`

For default region use 1 `us-east-1`

Next question select `[ Create new Application ]`

Next name the website

Complete remaining questions to finish `eb init`

There should now be a `.elasticbeanstalk` folder with a `config.yml` file

`eb create`

Select default Environment Name

Select default DNS CNAME (or change)

Select `2) application` for `load balancer type` - must be 2 to support web sockets

Wait for EB instance to be created, will take a few minutes

`eb open` to open the site in a browser

After changes are made to website, run `eb deploy` to push the changes to EB

