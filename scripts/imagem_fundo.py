# -*- coding: utf-8 -*-
"""
Padroniza fotos do catálogo: remove fundo branco da origem e coloca o produto
em fundo branco (visível no tema escuro do site).
"""

from __future__ import annotations

import numpy as np
from PIL import Image, ImageEnhance

DEFAULT_THRESHOLD = 248
DEFAULT_SOFTNESS = 22
MAX_SIDE = 900
CONTENT_FILL = 0.96
PAD_RATIO = 0.035
MIN_CONTENT_SIDE = 650
MATTE_RGB = (255, 255, 255)


def remove_white_background_array(
    rgba: np.ndarray,
    *,
    threshold: int = DEFAULT_THRESHOLD,
    softness: int = DEFAULT_SOFTNESS,
) -> np.ndarray:
    """Só remove pixels bem claros (não mexe em produtos escuros)."""
    r, g, b, a = rgba[:, :, 0], rgba[:, :, 1], rgba[:, :, 2], rgba[:, :, 3].astype(np.float32)
    m = np.minimum(np.minimum(r, g), b)
    low = float(threshold - softness)
    out_a = a.copy()
    solid = m >= threshold
    out_a[solid] = 0
    fade_mask = (~solid) & (m > low)
    if np.any(fade_mask):
        fade = (m[fade_mask] - low) / max(softness, 1)
        out_a[fade_mask] = np.maximum(0, a[fade_mask] * (1.0 - fade))
    rgba = rgba.copy()
    rgba[:, :, 3] = np.clip(out_a, 0, 255).astype(np.uint8)
    return rgba


def strip_white_edges(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert("RGBA"))
    arr = remove_white_background_array(arr)
    return Image.fromarray(arr, "RGBA")


def content_bbox_arr(alpha: np.ndarray, *, threshold: int = 18) -> tuple[int, int, int, int] | None:
    ys, xs = np.where(alpha > threshold)
    if len(xs) == 0:
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def defringe_rgba(arr: np.ndarray) -> np.ndarray:
    """Remove halo claro nas bordas do recorte."""
    arr = arr.copy()
    a = arr[:, :, 3]
    fringe = (a > 12) & (a < 245)
    if not np.any(fringe):
        return arr
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    m = np.minimum(np.minimum(r, g), b)
    wash = fringe & (m > 210)
    arr[wash, 3] = 0
    soft = fringe & ~wash
    arr[soft, 3] = (a[soft].astype(np.float32) * 0.65).astype(np.uint8)
    return arr


def enhance_product(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    rgb = im.convert("RGB")
    rgb = ImageEnhance.Brightness(rgb).enhance(1.08)
    rgb = ImageEnhance.Contrast(rgb).enhance(1.1)
    rgb = ImageEnhance.Sharpness(rgb).enhance(1.08)
    r, g, b = rgb.split()
    return Image.merge("RGBA", (r, g, b, im.split()[-1]))


def prepare_rgba(im: Image.Image, *, use_rembg: bool = False, session=None) -> Image.Image:
    if use_rembg and session is not None:
        from rembg import remove

        out = remove(im.convert("RGBA"), session=session)
        return Image.fromarray(defringe_rgba(np.array(out)), "RGBA")
    return strip_white_edges(im)


def standardize_catalog_png(
    im: Image.Image,
    *,
    max_side: int = MAX_SIDE,
    fill: float = CONTENT_FILL,
    pad_ratio: float = PAD_RATIO,
    use_rembg: bool = False,
    rembg_session=None,
    min_side: int = MIN_CONTENT_SIDE,
) -> Image.Image:
    """Recorte justo ao produto + margem mínima (sem faixas brancas nas laterais)."""
    src = im
    if min(im.size) < 900:
        scale_up = min(2.5, 900 / min(im.size))
        nw, nh = int(im.width * scale_up), int(im.height * scale_up)
        src = im.resize((nw, nh), Image.Resampling.LANCZOS)

    arr = np.array(prepare_rgba(src, use_rembg=use_rembg, session=rembg_session))
    try:
        arr = defringe_rgba(arr)
    except ImportError:
        pass
    bbox = content_bbox_arr(arr[:, :, 3])
    if bbox:
        arr = arr[bbox[1] : bbox[3], bbox[0] : bbox[2]]
    h, w = arr.shape[:2]
    if w < 1 or h < 1:
        return Image.new("RGB", (max_side, max_side), MATTE_RGB)

    limit = int(max_side * fill)
    scale = min(limit / w, limit / h)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    if min(nw, nh) < min_side:
        boost = min_side / min(nw, nh)
        nw, nh = max(1, int(nw * boost)), max(1, int(nh * boost))
        if max(nw, nh) > limit:
            shrink = limit / max(nw, nh)
            nw, nh = max(1, int(nw * shrink)), max(1, int(nh * shrink))

    product = enhance_product(Image.fromarray(arr, "RGBA").resize((nw, nh), Image.Resampling.LANCZOS))
    pad = max(10, int(max(nw, nh) * pad_ratio))
    out = Image.new("RGB", (nw + 2 * pad, nh + 2 * pad), MATTE_RGB)
    out.paste(product, (pad, pad), product)
    return out


def save_transparent_catalog_png(
    im: Image.Image,
    dest,
    *,
    use_rembg: bool = False,
    rembg_session=None,
) -> bool:
    """Nome legado: grava PNG com fundo branco e produto visível."""
    out = standardize_catalog_png(im, use_rembg=use_rembg, rembg_session=rembg_session)
    dest.parent.mkdir(parents=True, exist_ok=True)
    out.save(dest, format="PNG", optimize=True)
    return dest.exists() and dest.stat().st_size > 1500
