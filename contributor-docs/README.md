# :cyclone: Welcome! :cyclone:

Thank you for considering adding something to this library. Contributions of many different kinds are welcome and encouraged. This can mean anything from:
- making examples
- finding typos in documentation
- reporting bugs
- fixing bugs
- reporting device support
- adding better contributor docs
- writing tests
- suggesting new features
- implementing new features
- sharing teaching resources
- making concept art of the tearful xr logo
- writing critical essays about p5.xr
- using p5.xr to overthrow the ruling class.

That list is in no way exhaustive and you can definitely submit a pull request to add a new item to it.

This project follows the all-contributors specification. Add yourself to the readme by following the instructions here! Or comment in the GitHub issues with your contribution and we'll add you.

## File Structure

There are lots of files here but don't worry many of them aren't edited often and you don't need to know how all of the files work to help in a big way. We recommend beginning in one area, working on something specific, and then allow yourself to learn more about the library over time.

- `contributor-docs/` where you are currently. These are documents that explain the contribution process.
- `dist` is initially empty but it will hold the built library files after you first build the library, see [Setting up a development environment](#Setting-up-a-development-environment).
- `docs/` these files generate [the library website](http://p5xr.org/#/). The `.md` files in that folder are read by [docsify](https://docsify.js.org/#/) and used to generate the website. When you want to add new examples or change the wording in the website documentation, this is where you will do it.
- `src/` contains all of the source fcode for the library. The most important files are:
  - `app.js` is the entry point for building the library. With a few exceptions, this is where every extension of the p5 prototype belongs and it is where we add public functions that we want user to be able to call.
  - `core/p5xr.js` is the home of the `p5xr` class. This class contains all of the code that is used by both AR and VR modes. Both `p5vr` and `p5ar` extend this class because there is a surprising amount of overlap in their functionality.
- `tests/` this folder contains both the unit tests (automated tests) and the manual tests. The manual tests are a great way to see the outcomes of your changes.

## Setting up a development environment

We know the development process can be a little tricky at first. You're not alone, it's confusing for everyone at the beginning. The steps below walk you through the setup process. If you have questions, you can post an [issue](https://github.com/processing/p5.js/issues) that describes the place you are stuck, and we'll do our best to help.

1. Install [node.js](http://nodejs.org/), which also automatically installs the [npm](https://www.npmjs.org) package manager.

2. [Fork](https://help.github.com/articles/fork-a-repo) the [p5.js repository](https://github.com/processing/p5.js) into your own GitHub account.

3. [Clone](https://help.github.com/articles/cloning-a-repository/) your new fork of the repository from GitHub onto your local computer.

   ```
   $ git clone https://github.com/YOUR_USERNAME/p5.xr.git
   ```
4. Navigate into the project folder and install all its necessary dependencies with npm.

   ```
   $ cd p5.xr
   $ npm ci
   ```
5. [Parcel](https://parceljs.org/) should now be installed, and you can use it to build the library from the source code.

   ```
   $ npm run build
   ```

   If you're continuously changing files in the library, you may want to run `npm run watch` to automatically rebuild the library for you whenever any of its source files change without you having to first type the command manually.

6. If you made changes to source code, look at the relevant manual test examples to see that everything still works as expected. We are hoping to automate this with more unit tests in the future.

7. Make some changes locally to the codebase and [commit](https://help.github.com/articles/github-glossary/#commit) them with Git.
   ```
   $ git add -u
   $ git commit -m "YOUR COMMIT MESSAGE"
   ```

8. Run `npm run test` to make sure the existing unit tests pass.

9. Once everything is ready, submit your changes as a [pull request](https://help.github.com/articles/creating-a-pull-request).

## Code Syntax

p5.xr requires stylistically consistent code syntax, which it enforces using [ESlint](https://eslint.org/). You can also install an [ESlint plugin](https://eslint.org/docs/user-guide/integrations#editors) for your code editor to highlight errors as soon as you type them.

## Device-Specific Development

When modifying code related to VR it is important that you test your changes in both inline (on a desktop computer) and with a VR-capable device such as a Google Cardboard-capable Android phone, Oculus Quest, Oculus Rift, HTV Vive, or Valve Index.

With **VR devices** that connect to your computer through SteamVR (Vive, Index, Rift), you can simply open a test in an up-to-date Chrome Browser with SteamVR installed and setup.

With Oculus Quest, the Quest Browser should be used.

With Android Mobile for sketches made for both **AR and VR**, you can run `npm run generate:keys` on your development computer to create an SSL cert-key pair. Then you can run `http-server -S -C cert.pem` to start a secure local server. This should result in a message that gives you the IP address for your new secure local server (ex: `192.168.1.104:8080`). You can then add that IP into the URL input in the Chrome browser on your phone and access the p5xr folder from your phone. This allows you to run the `manual-test-examples` on your phone.