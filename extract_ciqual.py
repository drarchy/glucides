"""
Extraction des glucides depuis la base CIQUAL 2025 (XML)
Génère aliments.js pour l'application Compteur de Glucides.

Source : Anses. 2025. Table de composition nutritionnelle des aliments Ciqual 2025.
https://doi.org/10.57745/RDMHWY

Usage : python3 extract_ciqual.py
Prérequis : dossier aliments/ contenant les XML CIQUAL
"""
import xml.etree.ElementTree as ET

ALIM_XML = 'aliments/alim_2025_11_03.xml'
COMPO_XML = 'aliments/compo_2025_11_03.xml'
GLUCIDES_CODE = '31000'
OUTPUT = 'aliments.js'

# Parse aliments
alims = {}
for a in ET.parse(ALIM_XML).findall('.//ALIM'):
    code = a.find('alim_code').text.strip()
    nom = a.find('alim_nom_fr').text.strip()
    alims[code] = nom

# Parse compositions : glucides (g/100g)
glucides = {}
for c in ET.parse(COMPO_XML).findall('.//COMPO'):
    if c.find('const_code').text.strip() == GLUCIDES_CODE:
        code = c.find('alim_code').text.strip()
        try:
            val = float(c.find('teneur').text.strip().replace(',', '.'))
            glucides[code] = val
        except (ValueError, AttributeError):
            pass

# Assembler et trier par nom
entries = sorted(
    [(alims[c], glucides[c]) for c in alims if c in glucides],
    key=lambda x: x[0]
)

# Générer aliments.js
with open(OUTPUT, 'w') as f:
    f.write('// Base CIQUAL 2025 — Anses. Table de composition nutritionnelle des aliments Ciqual 2025\n')
    f.write('// Licence Ouverte — https://doi.org/10.57745/RDMHWY\n')
    f.write('const ALIMENTS = [\n')
    for nom, pct in entries:
        safe = nom.replace('\\', '\\\\').replace('"', '\\"')
        pct_s = str(int(pct)) if pct == int(pct) else f"{pct:.1f}"
        f.write(f'  {{nom:"{safe}",pct:{pct_s}}},\n')
    f.write('];\n')

print(f"{len(entries)} aliments extraits → {OUTPUT}")
