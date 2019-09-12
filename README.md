<p align="center">
  <img src="https://images.atomist.com/sdm/SDM-Logo-Dark.png">
</p>

# @atomist-blogs/ts-visualizer

This SDM visualizes aspects of TypeScript repositories.

[atomist-doc]: https://docs.atomist.com/ (Atomist Documentation)

## Using this

Clone this repository. 

Install the Atomist CLI: `npm install -g @atomist/cli`

Set up Postgres to store the data, as described in [Aspect support database setup](https://github.com/atomist/sdm-pack-aspect/#database-setup).

Inside this repo's directory, use the Atomist CLI to start this SDM: `atomist start --local`

Once that's going, visit `http://localhost:2866` and it should tell you that you need to analyze some repositories.

Use the CLI to send an analyze command. I used: 

`atomist analyze github by query --cloneUnder ~/temp --poolSize 5 --update true --query "language:typescript stars:>=1000 size:<=10000"`

This says to run that query on GitHub (TypeScript repos under 10Mb with 1000 stars), clone each repository under a local temp directory (handy for re-using clones after I change my code and want to run it again), run up to five of them at a time, and always update the data in the database.

That command will give you a link to watch the analysis as it's progressing: `http://localhost:2866/analysis`. Hit refresh to update.

When it's done, return to `http://localhost:2866` -- click on "Interactive Explorer" to see who has what input and output directories. Or look around.


### Database queries

For the record, after running an analysis I opened my Postgres database and used this to find the most frequent source directories:

```sql
select jsonb_array_elements(data -> 'directories')  as "Directory", count(*)
from fingerprints 
where name = 'TypeScriptSourceCountByDirectory'
group by 1
order by 2 desc;
```

## Contributing

Contributions to this project from community members are encouraged
and appreciated. Please review the [Contributing
Guidelines](CONTRIBUTING.md) for more information. Also see the
[Development](#development) section in this document.

## Code of conduct

This project is governed by the [Code of
Conduct](CODE_OF_CONDUCT.md). You are expected to act in accordance
with this code by participating. Please report any unacceptable
behavior to code-of-conduct@atomist.com.

## Documentation

Please see [docs.atomist.com][atomist-doc] for
[developer][atomist-doc-sdm] documentation.

[atomist-doc-sdm]: https://docs.atomist.com/developer/sdm/ (Atomist Documentation - SDM Developer)

## Connect

Follow [@atomist][atomist-twitter] and [the Atomist blog][atomist-blog].

[atomist-twitter]: https://twitter.com/atomist (Atomist on Twitter)
[atomist-blog]: https://blog.atomist.com/ (The Official Atomist Blog)

## Support

General support questions should be discussed in the `#support`
channel in the [Atomist community Slack workspace][slack].

If you find a problem, please create an [issue][].

[issue]: https://github.com/atomist-seeds/empty-sdm/issues

## Development

You will need to install [Node.js][node] to build and test this
project.

[node]: https://nodejs.org/ (Node.js)

### Build and test

Install dependencies.

```
$ npm install
```

Use the `build` package script to compile, test, lint, and build the
documentation.

```
$ npm run build
```

### Release

Releases are handled via the [Atomist SDM][atomist-sdm].  Just press
the 'Approve' button in the Atomist dashboard or Slack.

[atomist-sdm]: https://github.com/atomist/atomist-sdm (Atomist Software Delivery Machine)

---

Created by [Atomist][atomist].
Need Help?  [Join our Slack workspace][slack].

[atomist]: https://atomist.com/ (Atomist - How Teams Deliver Software)
[slack]: https://join.atomist.com/ (Atomist Community Slack)
