# Angular Popout Window

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/angular-popout-window)](https://www.npmjs.com/package/angular-popout-window)

with this component you can very simply popout any part of your Angular application into a new un-docked browser child window.

try the [online demo](https://shemesh.github.io/angular-popout-window/) to see some funky stuff.

supports opening several child windows.

thriving for a minimal footprint, ease of use, clean and compatible code.

## Installation
Install through npm:
```
npm install --save angular-popout-window
```

## Usage
add `PopoutWindowModule` into the `imports` array of your `@NgModule`:
```
import { PopoutWindowModule } from 'angular-popout-window';
...
@NgModule({
  imports: [ PopoutWindowModule ... ],
  ...
})
```
in your html wrap your content with the `<popout-window>` tag, and give it a name so it can be referenced:
```
<popout-window #popoutWindow1 >
... your html here ...
</popout-window>
```

to pop out call `popOut()`, to bring back inside call `popIn()`:
```
(click)="popoutWindow1.popOut()"
...
(click)="popoutWindow1.popIn()"
```

## 

upon `popOut()` we do our best to calculate dimensions and location of the content relative to screen, then position the new window at same position and size.

you can override this by explicitly setting each of those properties for the new child window: 
- `windowTop` - pixels from top of screen.
- `windowLeft` - pixels from left of screen.
- `windowWidth` - width of window in pixels.
- `windowHeight`  - height of window in pixels.

use `windowStyle` property to apply styles on the child window, or `windowStyleUrl` to add a css file.

`suppressCloneStyles` will skip the style cloning from parent to popped out window.

when the popped out child window is closed, by pressing its X button for example, it will run `popIn()` to bring the content back inside.

when the main page unload the popped window is closed.

starting in version 3.0.0 the package depends on Angular/core only (removed the cdk dependency on).

## Versions
note that version 4 is for ng14+.
for ng13- you should use version 3.1.1

## License

MIT
