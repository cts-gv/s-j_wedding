# Site Photos

Place your wedding photos in this folder. The couple can upload photos here manually (via GitHub or your file system) and reference them throughout the site.

## Usage

Drop image files into this folder, then reference them in the site using this pattern:

```
const MY_PHOTO =
   `${import.meta.env.BASE_URL}photos/your-image.jpg`;
```

## Folder structure suggestions
photos/hero/ — hero background and banner images
photos/gallery/ — couple gallery photos
photos/memory/ — photos for the "Loved Ones We Miss" section
photos/venue/ — venue and travel-related images
