# Malha geográfica

## `ba-municipios-topo.json`

TopoJSON com os **417 municípios da Bahia**.

| | |
|---|---|
| Formato | TopoJSON (`Topology`), quantizado |
| Objeto | `BA` — 417 geometrias, 1.192 arcos |
| Propriedades | `GEOCODIGO` (código IBGE, 7 dígitos), `NOME`, `UF` |
| Tamanho | 3,7 MB sem compressão (~280 KB via Brotli) |
| Origem | Extraído do painel `sec-ideb.vercel.app`; geometria derivada da malha municipal do IBGE (dado público) |

### Por que TopoJSON e não GeoJSON

As fronteiras entre municípios vizinhos são compartilhadas. O TopoJSON guarda
cada trecho de divisa uma única vez e as geometrias apenas referenciam esses
arcos, o que reduz muito o arquivo. Para desenhar, é preciso converter com
`topojson-client`:

```js
import { feature, mesh } from "topojson-client";
const geo = feature(topo, topo.objects.BA);
```

### Junção com os dados do painel

`GEOCODIGO` corresponde exatamente ao campo `codigo_municipio` dos registros
do painel — verificado: os 417 códigos coincidem dos dois lados, sem sobra
nem falta. O vínculo com os 27 NTEs vem da aba NTE da planilha, também pelo
código IBGE.

### Contorno dos NTEs

Não é preciso um segundo arquivo com as fronteiras regionais: elas podem ser
derivadas da própria malha municipal com `mesh`, devolvendo só as arestas em
que o NTE muda de um lado para o outro. Isso mantém as duas geometrias sempre
coerentes entre si.

### Peso

O arquivo é grande para carregar junto com a página. Se virar parte do painel,
vale carregá-lo sob demanda (só quando o mapa aparecer) e, se necessário,
simplificar a geometria — a precisão atual é bem maior do que um mapa de
indicadores em tela exige.
