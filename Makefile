build:
	rm -rf ios/ android/
	npx expo prebuild

run:
	npx expo run:android