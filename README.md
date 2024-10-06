# map-pointer-app
Aplicativo para guiar o [driver](https://github.com/Cinnamoon-dev/pan-tilt-map-pointer) de um laser pointer.

### Building app

1. Install dependencies

   ```bash
   npm install
   ```

2. Prebuild the app

   ```bash
    npx expo prebuild
   ```

### Running the app in an emulator

3. Start the app

   ```bash
    npx expo run:android
    npx expo run:ios
   ```

### Running the app in an android device
- Enable debugging over USB

- Plug in your device via USB
- Check that your device is properly connecting to Android Debug Bridge

   ```bash
    adb devices
   ```

- Start the app

   ```bash
    npm run android
    npm run ios
   ```

### Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Basic Bluetooth working
1. O aplicativo vai verificar se tem as permissões para acessar o módulo de bluetooth
   1. Caso não tenha, o aplicativo vai pedir as permissões e executar o que ele quer fazer quando as tiver
   2. Os dois passos acima podem entrar em um loop infinito caso as permissões não sejam dadas
2. O aplicativo vai escanear pelos dispositivos bluetooth próximos e poder ter acesso a cada um deles em uma lista em um state
3. O aplicativo vai se conectar a um desses dispositivos disponíveis atráves de um método da biblioteca BLE
4. Então o aplicativo vai mandar características para o laser pointer e receber as coordenadas de volta
