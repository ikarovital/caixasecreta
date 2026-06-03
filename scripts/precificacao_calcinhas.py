# -*- coding: utf-8 -*-
"""Regras de preço venda + combo 3 unidades (calcinhas)."""
from __future__ import annotations

import math

# Faixas atuais (preços mais baixos para atrair clientes)
VENDA_TIERS = [15, 25, 32, 42, 52, 53, 75, 85, 95, 120, 130, 135, 150, 180, 200, 240]
COMBO_BY_VENDA: dict[int, int] = {
    15: 35,
    25: 60,
    32: 85,
    42: 95,
    52: 135,
    53: 130,
    75: 180,
    85: 200,
    95: 240,
    120: 300,
    135: 320,
    150: 360,
    180: 420,
    200: 480,
    240: 560,
}
COMBO_TIERS = sorted(set(COMBO_BY_VENDA.values()) | {300, 360, 420, 480, 560})


def proximo_tier(valor: float, tiers: list[int]) -> int:
    for t in tiers:
        if t >= valor - 0.01:
            return t
    return int(math.ceil(valor / 5.0) * 5)


def preco_venda(custo: float) -> int:
    """Lucro > 100% (venda >= 2x custo). Baixo custo: ~3x; acima de R$12: ~2,3x."""
    if custo <= 0:
        return 15
    piso = custo * 2.01
    alvo = custo * 3.0 if custo < 12 else custo * 2.3
    return proximo_tier(max(piso, alvo), VENDA_TIERS)


def combo_tres(venda: int) -> int:
    if venda in COMBO_BY_VENDA:
        return COMBO_BY_VENDA[venda]
    return proximo_tier(venda * 2.33, COMBO_TIERS)


def fmt_br_money(value: float, decimals: int = 2) -> str:
    txt = f"{value:,.{decimals}f}"
    return txt.replace(",", "X").replace(".", ",").replace("X", ".")


def texto_preco_inline(venda: float, combo: float) -> str:
    v = fmt_br_money(venda)
    c = fmt_br_money(combo, 0 if combo == int(combo) else 2)
    return f"R$ {v} | 3x {c}"
