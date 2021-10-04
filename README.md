# BILETUJO

Com-Chain multi-currency Wallet

## History

Free and open-source Client for ethereum token based currency and
barter systems.  It was forked from MyEthereumWallet then reworked,
customized by Florian and Dominique on behalf of Monnaie Leman the
Leman Lake Local Currency. A multi-currency version has been created
and is maintained by Com-Chain (see com-chain.org)

## Features

Biletujo is a multi-currency wallet allowing to access any of the
currencies hosted by Com-Chain.

It is designed for looking for and selecting a Com-Chain API node.

Once a wallet is opened the code retrive the configuration for the
corresponding currency and adapt the available functionalities. It
also change the css skin and icons to reflet the currency colors.

## Our Philosophy

- Empower the people: Give people the ability to interact with the
  Ethereum blockchain easily, without having to run a full node.

- Make it easy & free: Everyone should be able to create a wallet and
  send Tokens without additional cost.  People are the Priority: People
  are the most important.

- If it can be hacked, it will be hacked: Never save, store, or
  transmit secret info, like passwords or keys. Open source &
  auditable.

## Contact

If you can think of any other features or run into bugs, let us
know. You can drop a line at it {at} monnaie {-} leman dot org.

## Developing

We recommend you to install and use ``nvm``, this will let you change
``node`` version easily for this project.

```sh
nvm use  ## will read the ~/.nvmrc and switch to compatible version of node

npm install
```

We are using ``gulp``, so you can have a look in gulpfile to see the targets.

To launch a target, use: ``npx gulp TARGET``. ``npx`` allows you to
switch to your directory-local binaries (installed thanks to ``npm
install``), and launch ``gulp`` from it.

```sh
npx gulp  ## gulp default is to build, and watch
```

The watching mode allows to trigger a build each time a file is modified.

To run the browser version of the app, you should:

```sh
cd cordova_dist
npx cordova run browser
```

This should launch your browser automatically on the app.
