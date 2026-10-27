`astal` 의 버전이 올라가면서 더 이상 astal gjs가 지원되지 않는데, 이걸 마이그레이션 하고 싶어.

## 결론

**Astal 전체를 포크하기보다는, 기존 `astal` GJS 계층을 AGS/Gnim으로 마이그레이션하는 편이 좋습니다.** 현재 Astal에서 없어진 것은 GJS 런타임 자체가 아니라 예전의 고수준 JavaScript 패키지입니다. 최신 구조는 다음처럼 분리되어 있습니다.

- **Astal**: `AstalHyprland`, `AstalNotifd`, `AstalWp` 같은 C/Vala 기반 GI 라이브러리
- **Gnim**: GJS용 JSX와 반응형 상태 관리
- **AGS**: 애플리케이션 수명주기, 파일·프로세스·타이머 유틸리티와 번들링

Astal 저장소도 기존 GJS 코드가 Gnim으로 이동했다고 명시하고 있으며, 현재 Astal flake에는 예전 `gjs` 패키지 출력이 없습니다. [GitHub](https://raw.githubusercontent.com/Aylur/astal/refs/heads/main/flake.nix)

Midnightway를 정적으로 살펴본 기준으로는 **GJS 쪽 약 10여 개 파일과 빌드 설정만 마이그레이션하면 되고, WebKit 안에서 실행되는 React renderer는 거의 건드릴 필요가 없습니다.** 따라서 포크 규모의 재작성이라기보다는 작은~중간 규모의 마이그레이션에 가깝습니다. [GitHub](https://raw.githubusercontent.com/HelloWorld017/midnightway/master/package.json)

---

## 권장 구조

```text
Midnightway
├─ GJS shell
│  ├─ AGS: app, process, file, time
│  ├─ Gnim: JSX, Accessor, state
│  └─ Astal GI: Hyprland, Mpris, Notifd, Wp...
│
└─ WebKit renderer
   └─ React/Rspack — 현재 구조 유지
```

현재 직접 사용하는 서비스 모듈은 대부분 이미 `gi://AstalHyprland`, `gi://AstalMpris`, `gi://AstalNotifd` 형식이므로 그대로 유지할 수 있습니다. 교체해야 하는 부분은 주로 `astal`, `astal/gtk4`, `Variable`, `bind`, `astalify`, `App`입니다. [GitHub](https://raw.githubusercontent.com/HelloWorld017/midnightway/master/src/repository/index.ts)

## API 대응표

| 기존 Astal GJS | AGS/Gnim |
|---|---|
| `@jsxImportSource astal/gtk4` | `@jsxImportSource ags/gtk4` |
| `App` | `app` from `ags/gtk4/app` |
| `Astal`, `Gtk`, `Gdk` | from `ags/gtk4` |
| `setup={callback}` | `$={callback}` |
| `astalify(SomeWidget)` | GI 위젯을 JSX에서 직접 사용 |
| `Variable(initial)` | `createState(initial)` |
| `Variable.derive(...)` | `createComputed(...)` |
| `variable.poll(...)` | `createPoll(...)` |
| `variable.watch(...)` | `createSubprocess(...)` |
| `bind(gobject, property)` | `createBinding(gobject, property)` |
| `readFile*` | `ags/file` |
| `exec*` | `ags/process` |
| 타이머·poll | `ags/time` |

이는 현재 AGS 공식 마이그레이션 가이드에 제시된 대응 관계입니다. [aylur.github.io](https://aylur.github.io/ags/guide/migration-guide.html)

---

## 1. 애플리케이션과 JSX부터 변경

`src/index.tsx`는 대략 다음 형태가 됩니다.

```tsx
/** @jsxImportSource ags/gtk4 */

import app from "ags/gtk4/app";
import { Astal, Gdk, Gtk } from "ags/gtk4";

app.start({
  main() {
    eachMonitor((monitor) => (
      <MdApp monitor={monitor} />
    ));
  },
});
```

`MdApp.tsx`도 다음처럼 바꿉니다.

```tsx
/** @jsxImportSource ags/gtk4 */

import app from "ags/gtk4/app";
import { Astal, Gdk, Gtk } from "ags/gtk4";

export function MdApp({ monitor }: { monitor: Gdk.Monitor }) {
  return (
    <window
      application={app}
      monitor={monitor}
      $={(window) => {
        // 기존 setup 내용
      }}
    >
      {/* ... */}
    </window>
  );
}
```

주요 기계적 변경은 다음 두 가지입니다.

```diff
- setup={(self) => { ... }}
+ $={(self) => { ... }}

- App.apply_css(css)
+ app.apply_css(css)
```

현재 AGS 앱 API에도 `start`, `apply_css`, `get_monitors`, `remove_window` 등 유사한 기능이 남아 있어 앱 수명주기 자체는 크게 달라지지 않습니다. [GitHub](https://raw.githubusercontent.com/Aylur/ags/refs/heads/main/lib/gtk4/index.ts)

---

## 2. `astalify(WebKit.WebView)` 제거

현재 `MdWebView.tsx`에서는 WebKit 위젯을 `astalify`로 감싸고 있습니다. Gnim에서는 GI 기반 GTK 위젯을 JSX 생성자로 직접 사용할 수 있습니다.

```tsx
/** @jsxImportSource ags/gtk4 */

import Gio from "gi://Gio?version=2.0";
import GLib from "gi://GLib?version=2.0";
import WebKit from "gi://WebKit?version=6.0";

export function MdWebView() {
  return (
    <WebKit.WebView
      hexpand
      vexpand
      cssClasses={["webview"]}
      $={(webView) => {
        // 기존 setupWebView 내용
      }}
    />
  );
}
```

```diff
- import { astalify, Gio, GLib } from "astal/gtk4"
- const WebView = astalify(WebKit.WebView)
+ import Gio from "gi://Gio?version=2.0"
+ import GLib from "gi://GLib?version=2.0"

- <WebView setup={setupWebView} />
+ <WebKit.WebView $={setupWebView} />
```

Gnim의 현재 JSX 런타임은 일반 GI 위젯을 직접 생성하는 방식이며 `astalify`는 제거되었습니다. [aylur.github.io](https://aylur.github.io/ags/guide/migration-guide.html)

---

## 3. `Variable`을 한 번에 없애지 말고 얇은 호환 계층 추가

Midnightway의 경우 `Variable` 자체보다 `asConnectable`이 중요한 경계입니다. `asConnectable`은 값이 `.get()`, `.set()`, `.subscribe()`를 제공한다고 가정하고 이를 WebKit bridge에 노출합니다. [GitHub](https://raw.githubusercontent.com/HelloWorld017/midnightway/master/src/utils/binding/asConnectable.ts)

Gnim의 `Accessor`는 읽기와 구독은 제공하지만, `createState`의 setter는 별도로 반환됩니다.

```ts
const [value, setValue] = createState(initial);
```

따라서 초기에 작은 어댑터를 두는 것이 안전합니다.

```ts
// src/platform/reactivity.ts
import {
  createComputed,
  createState,
  type Accessor,
} from "ags";

export type WritableAccessor<T> = Accessor<T> & {
  set(value: T): void;
};

export function writable<T>(initial: T): WritableAccessor<T> {
  const [value, setValue] = createState(initial);

  return Object.assign(value, {
    set: setValue,
  });
}

export function subscribeValue<T>(
  value: Accessor<T>,
  callback: (value: T) => void,
): () => void {
  const update = () => callback(value());

  update();
  return value.subscribe(update);
}

export { createComputed };
```

이렇게 하면 기존 코드에서:

```diff
- const state = Variable(initial)
+ const state = writable(initial)

state.set(nextValue)
state.subscribe(callback)
```

형태를 상당 부분 유지할 수 있습니다.

`asConnectable`의 읽기 부분은 Gnim Accessor가 함수라는 점을 지원하도록 변경하면 됩니다.

```ts
function readValue<T>(
  value: Accessor<T> | { get(): T },
): T {
  return typeof value === "function"
    ? value()
    : value.get();
}
```

Gnim의 `Accessor`에는 현재 `.get()`도 남아 있지만 deprecated 상태이므로, 장기적으로는 호출 구문인 `value()`를 사용하는 편이 좋습니다. [GitHub](https://raw.githubusercontent.com/Aylur/gnim/refs/heads/main/src/jsx/state.ts)

### `createBinding`을 무조건 사용하면 안 되는 이유

Gnim의 `createBinding()`은 실제 `GObject.Object` 또는 `Gio.Settings`를 대상으로 합니다. Midnightway의 `overlayRepository` 등은 `Proxy` 기반 커스텀 객체이므로 다음 변환은 동작하지 않습니다.

```diff
- bind(repositoryImpl.overlay, "overlayItems")
+ createBinding(repositoryImpl.overlay, "overlayItems") // 사용하면 안 됨
```

대신 원본 Accessor를 내보내고 직접 구독하는 것이 좋습니다.

```ts
export const overlayItems = createComputed(() => {
  const state = toolkitState();

  return state
    ? [{ kind: "toolkit", state }]
    : [];
});
```

```ts
const cleanup = subscribeValue(overlayItems, (items) => {
  updateInputRegion(items);
});
```

현재 `createBinding` 구현이 `GObject.Object` 여부를 검사한다는 점 때문에, 이 커스텀 bridge 경계에는 로컬 어댑터가 필요합니다. [GitHub](https://raw.githubusercontent.com/Aylur/gnim/refs/heads/main/src/jsx/state.ts)

---

## 4. repository별 변환

### `Variable.poll`

예를 들어 network와 temperature는 다음처럼 바꿀 수 있습니다.

```ts
import { createPoll } from "ags/time";

export const temperature = createPoll<number | null>(
  null,
  2_000,
  ["sh", "-c", "cat /sys/class/thermal/thermal_zone0/temp"],
  (output) => Number(output.trim()) / 1000,
);
```

비동기 함수를 직접 넘기는 형태도 사용할 수 있습니다.

```ts
const usage = createPoll(
  initialUsage,
  updateInterval,
  async () => {
    return await readNetworkUsage();
  },
);
```

### `Variable.watch`

`vmstat`처럼 장기 실행되는 프로세스는 `createSubprocess`로 옮깁니다.

```ts
import { createSubprocess } from "ags/process";

const vmstat = createSubprocess(
  initialVmStat,
  ["vmstat", "1", "-y"],
  (line) => parseVmStat(line),
);
```

### `Variable.derive`

```diff
- const overlayItems = Variable.derive(
-   [toolkitState],
-   (state) => state ? [{ kind: "toolkit", state }] : [],
- )
+ const overlayItems = createComputed(() => {
+   const state = toolkitState()
+   return state ? [{ kind: "toolkit", state }] : []
+ })
```

`createPoll`과 `createSubprocess`는 구독자가 생길 때 동작하고 구독이 끝나면 정리되는 구조라, 기존 `onDropped()` 정리 코드를 줄일 수 있습니다. [aylur.github.io](https://aylur.github.io/ags/guide/utilities.html)

---

## 5. `eachMonitor`는 단순 import 변경으로 끝나지 않음

이 부분은 주의해야 합니다.

현재 Midnightway의 `eachMonitor.ts`는 앱의 `monitor-added`, `monitor-removed` 신호를 구독합니다. 최신 AGS 앱 구현은 모니터 목록을 `monitors` 프로퍼티로 노출하고 `notify::monitors`를 발생시키는 구조에 가깝습니다. 따라서 단순히 `App`을 `app`으로 바꾸면 모니터 hot-plug가 깨질 수 있습니다. [GitHub](https://raw.githubusercontent.com/HelloWorld017/midnightway/master/src/components/astal/utils/eachMonitor.ts)

다음처럼 목록을 diff하는 방식이 안전합니다.

```ts
import app from "ags/gtk4/app";
import type Gdk from "gi://Gdk?version=4.0";
import type Gtk from "gi://Gtk?version=4.0";

export function eachMonitor(
  create: (monitor: Gdk.Monitor) => Gtk.Window,
): () => void {
  const windows = new Map<Gdk.Monitor, Gtk.Window>();

  const reconcile = () => {
    const current = new Set(app.get_monitors());

    for (const [monitor, window] of windows) {
      if (!current.has(monitor)) {
        app.remove_window(window);
        window.destroy();
        windows.delete(monitor);
      }
    }

    for (const monitor of current) {
      if (!windows.has(monitor)) {
        windows.set(monitor, create(monitor));
      }
    }
  };

  reconcile();

  const signal = app.connect("notify::monitors", reconcile);

  return () => {
    app.disconnect(signal);

    for (const window of windows.values())
      window.destroy();

    windows.clear();
  };
}
```

실제 GJS 타입 선언에 따라 `remove_window()` 인자가 이름인지 윈도우 객체인지 조정해야 하지만, 핵심은 **added/removed 신호 대신 모니터 목록 reconcile**입니다.

---

## 6. Nix 및 빌드 변경

현재 flake에는 다음 두 가지가 예전 Astal GJS에 묶여 있습니다.

- `astalPkgs.gjs`
- `EXTERN_ASTAL = .../share/astal/gjs`

이를 제거하고 AGS를 입력과 빌드 도구로 추가합니다. [GitHub](https://raw.githubusercontent.com/HelloWorld017/midnightway/master/flake.nix)

개념적으로는 다음과 같습니다.

```nix
inputs = {
  nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  astal.url = "github:Aylur/astal";

  ags = {
    url = "github:Aylur/ags";
    inputs.nixpkgs.follows = "nixpkgs";
    inputs.astal.follows = "astal";
  };
};
```

```nix
let
  astalPkgs = astal.packages.${system};
  agsPkg = ags.packages.${system}.default;
in
pkgs.stdenv.mkDerivation {
  nativeBuildInputs = [
    agsPkg
    pkgs.nodejs
    pkgs.pnpm
    pkgs.wrapGAppsHook
  ];

  buildInputs = [
    patchedAstal4
    astalPkgs.battery
    astalPkgs.hyprland
    astalPkgs.mpris
    astalPkgs.network
    patchedNotifd
    astalPkgs.tray
    astalPkgs.wireplumber
  ];

  # astalPkgs.gjs 삭제
  # EXTERN_ASTAL 삭제
}
```

공식 AGS Nix 예제도 AGS를 `nativeBuildInputs`에, 필요한 Astal 라이브러리를 `buildInputs`에 추가한 뒤 `ags bundle`을 실행합니다. [aylur.github.io](https://aylur.github.io/ags/guide/nix.html)

### Rspack은 renderer에만 남기는 것이 안전

현재 Rspack 설정은 TypeScript loader에서 `node_modules`를 제외합니다. 반면 AGS/Gnim 패키지는 TypeScript 소스를 export합니다. 따라서 단순히 `pnpm add ags gnim`만 하고 현재 설정으로 번들링하면 loader나 모듈 해석 문제가 생길 가능성이 큽니다. [GitHub](https://raw.githubusercontent.com/HelloWorld017/midnightway/master/rspack.config.ts)

권장 빌드 흐름은 다음과 같습니다.

```text
1. Rspack으로 renderer.js 생성
2. ags bundle로 GJS entry 생성
3. 두 결과물을 같은 libexec 디렉터리에 설치
```

예시:

```sh
pnpm run build:renderer
ags bundle src/index.tsx dist/midnightway
cp dist/renderer.js "$out/libexec/midnightway/"
cp dist/midnightway "$out/libexec/midnightway/"
```

`MdWebView.tsx`가 `import.meta.url`을 기준으로 `renderer.js`를 찾고 있으므로, 번들 분리 후에도 두 파일의 상대 위치가 기존과 같도록 해야 합니다.

Rspack을 GJS entry에도 계속 사용하려면 `node_modules/ags`와 `node_modules/gnim`을 loader 대상에 포함하거나, AGS/Gnim을 Nix store의 런타임 모듈로 externalize하는 추가 설정이 필요합니다. 초기 마이그레이션에서는 `ags bundle` 쪽이 단순합니다.

---

## 포크 판단

### Astal 전체 포크: 비추천

GJS 계층은 이미 Gnim/AGS로 이동했기 때문에, 옛 Astal GJS를 포크하면 다음까지 직접 유지해야 합니다.

- 새 GJS 및 GI 버전 호환성
- JSX 런타임
- 반응형 시스템
- GTK3/GTK4 API 변화
- Astal 서비스 패키지 타입 생성
- Nix 패키징

Midnightway가 실제로 사용하는 옛 GJS 기능은 그보다 훨씬 좁습니다. 따라서 **필요한 부분만 로컬 호환 계층으로 구현하는 것이 비용이 훨씬 작습니다.**

### `astal4-fixed-exclusivity.patch`

이 패치는 현재 upstream Astal4에는 없는 `FIXED` exclusivity와 `exclusivity_size` 프로퍼티를 추가합니다. [GitHub](https://raw.githubusercontent.com/HelloWorld017/midnightway/master/patches/astal4-fixed-exclusivity.patch)

하지만 underlying `gtk4-layer-shell`에는 이미 고정 exclusive zone을 지정하는 함수가 있으며, GObject Introspection도 지원합니다. [wmww.github.io](https://wmww.github.io/gtk4-layer-shell/gtk4-layer-shell-GTK4-Layer-Shell.html)

따라서 다음처럼 Astal 패치를 없앨 가능성이 있습니다.

```ts
import Gtk4LayerShell from "gi://Gtk4LayerShell";

$={(window) => {
  Gtk4LayerShell.set_exclusive_zone(window, exclusivitySize);
}}
```

타깃 시스템에 설치되는 typelib의 정확한 namespace는 한 번 확인해야 하지만, 이 방식이 가능하면 해당 Astal4 포크는 완전히 제거할 수 있습니다.

### `astal4-utils.patch`

이 패치는 Cairo rectangle으로 region을 만드는 아주 얇은 유틸리티입니다. [GitHub](https://raw.githubusercontent.com/HelloWorld017/midnightway/master/patches/astal4-utils.patch)

이 기능은 Astal에 넣기보다 Midnightway 내부 helper로 옮기는 것이 좋습니다.

```ts
function createInputRegion(rectangles: cairo.RectangleInt[]) {
  // cairo.Region API를 사용해 로컬에서 region 구성
}
```

이 패치 하나 때문에 Astal4를 포크할 이유는 거의 없습니다.

### `notifd` 패치

Notifd의 이미지 크기, markup capability, canonical append 확장은 GJS 마이그레이션과 독립적인 기능입니다. 우선 현재처럼 Nix patch로 유지하고, 새 Astal 버전에서 충돌이 반복될 때만 **Notifd 패키지만 좁게 포크**하는 편이 좋습니다. Astal 저장소 전체를 포크할 필요는 없습니다. [GitHub](https://raw.githubusercontent.com/HelloWorld017/midnightway/master/patches/astal-notifd-images.patch)

---

## 추천 PR 순서

1. **앱 껍데기 전환**
   - AGS input 추가
   - `astalPkgs.gjs`, `EXTERN_ASTAL` 제거
   - JSX import source, `App`, `setup`, `astalify` 변경
   - `eachMonitor` 재작성

2. **반응형 호환 계층 추가**
   - `writable`
   - `subscribeValue`
   - `asConnectable`의 Accessor 지원
   - overlay 입력 영역 구독 변경

3. **repository를 순차 변환**
   - `Variable.poll` → `createPoll`
   - `Variable.watch` → `createSubprocess`
   - `Variable.derive` → `createComputed`
   - 파일 API → `ags/file`

4. **Astal4 패치 축소**
   - Cairo Utils를 로컬 helper로 이동
   - fixed exclusivity를 `Gtk4LayerShell.set_exclusive_zone()`으로 대체
   - Notifd patch만 별도 유지

정리하면, **GJS 레이어는 포크하지 않고 AGS/Gnim으로 이전하고, Midnightway 전용 bridge를 위한 수십 줄 규모의 호환 레이어만 두는 방식**이 가장 안정적입니다. Astal 쪽 포크가 필요하더라도 전체가 아니라 `notifd` 같은 수정된 라이브러리만 좁게 유지하는 것이 적절합니다.
