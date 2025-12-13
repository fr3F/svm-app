// src/data/songs.ts
export interface Song {
  id: string;
  title: string;
  lyrics?: string;
  type?: "playback" | "lyrics";
  audio?: any;
}

export const songs: Song[] = [
  {
    id: "1",
    title: "Havaoziko eto anio",
    type: "playback",
    audio: require("@/assets/audio/playback/Faneva.mp3"),
    lyrics: `
      1. Havaoziko eto anio ilay voady izay natao
      Izaho Jesoa hanompo Anao
      Ka n’aiza n’aiza toerana hanirahanao
      Inty iraho fa vonona aho
      Ho fadiako ireo izay mety hanimba ahy
      Tsy @ heriko fa @ herin’ny Fanahy
      Ilay Fanahinao mpitari-dalana ahy

      Ref: Manolo-tena, manaiky ho tefena e
      Ho fantsona hampandeha ny asanao
      Na hiatra aman’aina, tsy maintsy efaina
      Na ho mora na ho sarotra no hatao
      Vonon-kandroso, mpanompo mazoto
      Ianao Jesoa no ataoko rehareha
      F’ireo fisedrana dia lala-kombana
      Hizoran’ireo mpino marobe

      2. Hatr@zay tsy mbola niova taminay
      Ilay fitiavanao ry Ray
      Teo foana Ianao nitsilo sady nampiray
      Nihahy ny fikambananay
      Nifandimby tao ny tsiky sy tomany
      F’Ianao no nomba anay hatrany
      Nampahery nampandresy nampifoha
      Dia mbola tokinay Ianao mpanome soa
      Na ny lanitra ho manga na ho raho-mitatao
      Ny vokovokomanga Jesoa tsy hiala Aminao
      20 taona miampy 5 ny fikambananay
      Dia mbola ho Anao anio ampitso rahatrizay
      Fa ny fahasoavanao no nahatoy izao
      Dia ekenay izay fitantananao

      RANTSANA FANATENANA MALAZA FAHAZAVANA`
  },
  {
    id: "2",
    title: "Ahy Ianao",
    type: "playback",
    audio: require("@/assets/audio/playback/Ahy Ianao.mp3"),
    lyrics: `
      Fa Ahy Ianao, ahy Ianao 
      Mampandresy Ianao

      1. Tao anaty aizin-kitroka aho no miantso Anao
      Tsy nanampin-tsofina fa nihaino ahy Ianao
      Nampiatraka ahy, nanolo tanana anay tokoa
      Mbola hafa ny manana Anao Jesoa

      Ref: Fa Mampandresy Ianao e! Zoky be fitia
      Mamafa ranomaso raha sendra ory izahay ety
      Anilanay hatrany tsy mba mandao
      Ambaranay fa hafa loatra e! Ny mialoka Aminao

      2. Namboarinao hahitsy izany lalako
      Raha mitady hianjera hazoninao ny tanako
      Fahazaran-dratsy izay namatotra ahy taloha
      Avy dia nivaha vao niteny Ianao Jesoa
      Ka sahiko anio ny milaza fa ahy Ianao
      Na misy tadio matoky manana Anao e!
      Ny omaly sy anio, ny ampitso efa an-tananao
      Ireo sedrako ampio, fa mampandresy Ianao

      RANTSANA FANATENANA MALAZA FAHAZAVANA`
  },
  {
    id: "3",
    title: "An-tananao",
    type: "playback",
    audio: require("@/assets/audio/playback/an-tananao.mp3"),
    lyrics: `
      1. Iza moa no mihoatra noho Ianao
      Ety @ izao tontolo izao
      No afaka hanome fiadanam-po
      Tsy misy hafa tsy ianao ry Tompoko
      K'izany no hiankinako Aminao
      Ny fiainako hatrizay ka hatram'izao
      Ny ambadiky ny ho avy manontolo
      Omeko Anao ka hanjakao daholo

      Ref: Fa eo an-tananao no apetrako ny foko
      Tsy misy mihoatra Anao ry tompon'ny tompo
      Ao @nao ny fahefana sy ny hery
      Fa Ianao, Ianao no momba sy mijery

      2. Jesosy ô! Inty ny zandrinao
      Mivavaka aho miangavy mitalaho
      Ny ankohonana nomenao ahy
      'Reo namako ampanekeo ho anao Ray
      Ny fon'ny ray sy reniko hanjakao
      'Reo namako voafatotra vahao
      Ny firenenay Tompo ô iasao
      Mangataka aho @ anaranao

      RANTSANA FANATENANA MALAZA FAHAZAVANA`
  },
  {
    id: "5",
    title: "Atanjao ny finoana",
    type: "playback",
    audio: require("@/assets/audio/playback/Atanjao ny finoana.mp3"),
    lyrics: `
      1.Fa ny fiainana an-tany, feno sento sy tomany
      Nefa izao aza adino raha Jesoa no fanilo ho voavonjy izay mino
      Matoky lalandava, omeny anao zay sahaza
      Aza manahy foana fa anio no fotoana hanavotany anao
      Ny fonao atolory, aza lavina akory
      Ny olanao efa reny raha Jesoa no miteny dia hitsahatra ireny
      Atanjao ny finoana, ianao mivonona
      Raha tinao ny mpandresy dia ovao izay tsy mety mba ho fiainan-baovao

      2.Raha tinao hialana, ireo karaza-pahotana
      Aza misalasala fa Jesosy malala vahaolana tsara
      Raiso ho famonjena, fakam-panahy resena
      Ny finoana no apinga, tano mafy tsy ho simba izay efa hananao
      Aza miandry voasazy, vao manao azafady
      Fa Jesoa be fitia no andatsa anao sanatria mibebaha malakia
      Atanjao ny finoana, ka avia manantona
      Raha tinao ny ho tafita dia aza hodina tsy hita ilay fitiavany anao

      RANTSANA FANATENANA MALAZA FAHAZAVANA
    `
  },
  {
    id: "6",
    title: "Ekeko",
    type: "lyrics",
    lyrics: `
    1.Matoa nataonao de anjarako izany
Na mafy indrindra aza Ianao tsy manary(×2)
Mitsinjo ahy hatrany manitsy ny dia
Izay rehetra miseho dia ekeko satria avy Aminao
Matoa nataonao dia natao ho zakaiko
Na dia mafaitra hampiongotra ny aiko na hiala aza ny aiko
Eo foana Ianao mampandresy ahy hatrany
Mampitraka ny loha manafaka jaly, mamafa tomany

Ref: Ekeko ry Tompo ny fitondranao
Ka ny sitrakao ihany no tanterao
Raha sendra mania aho anaro fa zaza
Fa avy Aminao izay rehetra mitranga
Ekeko ry Tompo ny hazo fijaliako
Noho ny Aminao irery no anto-pisiako
Raha tojo alahelo aho ka mety tomany
Ianao no antenaiko ampitsahatra izany

2.Matoa nataonao ireo fitsapana
Dia tianao ny fiainako hanam-piovana(×2)
Hanefy ny toetra ary koa ny fiteny
Soa fa niseho ireny rehetra ireny Avy Aminao
Matoa nataonao dia hainao fa tsara
Na andro migaina na koa mamanala ny fiainako
Fantatrao Tompo ny mahasoa ahy
Ekeko izay fomba hitondranao ahy(×2)

RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "7",
    title: "Endrey Ray! ",
    type: "playback",
    audio: require("@/assets/audio/playback/Endrey Ray.mp3"),
    lyrics: `
      Endrey Ray! Endrey ny fitiavanao ahy
      Ravoravo ny foko ô, anilanao mahatamana hoa Jesoa
      Tonitony ty saiko ty ê, hifadika @nao dia sanatria ê

      Raha ny hadalana efa nataoko bye2
      Zah le naditra efa endry @ izay
      Ny amiko rehetra indrindra ny fo
      Efa natolotro ho Anao avokoa, marina ê a

      Tsy haditra intsony aho fay ê
      Efa tonga saina aho ka hody @ izay ê
      N’inon’inona faka-panahy tsy ahoanay ê
      Mizotra manakany @ Jesoa Tompo ny lalanay ê

      Efa ela be no miantso anao ny Tompo
      Omeo ho dioviny anie ê, ny fonao maloto
      Tsy atao forcé, iz koa anao tsy mety
      Fiainanao io anie ho rava vetivety

      RANTSANA FANATENANA MALAZA FAHAZAVANA

    `,
  },
  {
    id: "8",
    title: "Hanaraka Anao",
    type: "lyrics",
    lyrics: `
      1.Tsy tako-nafenina ny fiainana eto an-tany
      Miovaova mikorotana ambony sy ambany
      Miolakolaka fiakarana sady fidinana
      Miodikodina toa tsy ahitana mangirana
      Fa ny manana Anao Jesoa tsy mba ho kivy amin'izany
      Na mafy aza ny olana ka mety mampitomany
      Ny ahy ny fantatro dia zavatra tokana ihany
      Jesosy ô hanaraka Anao aho hatrany amin'ny faran'ny tany

      Ref:Hanaraka Anao aho na aiza na aiza hitondranao ahy
      Ka na inona zavatra hitranga vonon-kanaraka Anao hoa izaho
      Fa na dia mideza be ny lalana izay haleha
      Efa hevitra tapaka ny ahy Tompo ô iraho aho fa andeha

      2.Tsy misy mampanahy na mafy aza ny ady sy tolona
      Eny hafoiko ny aiko, inty aho ry Tompo fa vonona
      Tsy ahoako izay mety ho fisedrana ety
      Ny hiverin-dalana aloha ataoko ho sanatria
      Ny manaraka Anao Jesoa tsy mba mihemotr'izany
      Tsy misy matahotra miroso amin'ny lalina hatrany
      Ny atao ao an-doha dia zavatra tokana ihany
      Hitety an'i Jodia, Samaria hatrany amin'ny faran'ny tany

      Hanaraka Anao aho Jesosy ô
      Andeha aho n'aiza n'aiza aleha
      Hitory ny Anaranao Jesosy ô
      Iraho fa vonon'aho ny andeha

      RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "9",
    title: "Hidera anao",
    type: "lyrics",
    lyrics: `
      1.Mendrim-piderana Tompo ô!ny anaranao ilay nahary izao tontolo izao
      Fa feno fahatsarana raha ny asa tananao,
      maneho ny haben'ny voninahitrao
      Koa asandratray anio ny amboaram-peo MIKALO,
      mitory ny famonjena vitanao
      Avy ao am-po madio hitoetra fa tsy handalo,
      hiderako fa talenta avy Aminao

      Ref: Ny anaranao no ho deraiko n'aiza misy ahy,
      satria Ianao ilay namonjy ahy
      Hijoro hatrany hatrany aho ho mpanompo tena sahy,
      na maro aza ireo fakam-panahy
      Hikalo aho hidera, hihira hanandram-peo, ataoko am-pifaliana foana
      Tsy hiandry ela ka na inona miseho na mafy aza eo anoloana...
      Izaho hidera Anao

      2.Hiakam-pifaliana ventesiko hanako, hafaliana tsy omby tratra
      Na oviana na oviana ny hobiko tsy hiato,
      ho Anao mpanjakan'ny mpanjaka
      Asandratray ho re hatrany am-paran-tany, torianay ny filazantsara
      Na kely na lehibe tsy havahana amin'izany, samy mba mahazo anjara

      Mikalo aho,kalokalo avy ao am-po
      Hiderako anao ry ilay Tsitoha
      Mivalo aho,mivoady ihany koa
      Tsy hiemotra aho na inona manjo....Hiaraka Aminao

      RANTSANA FANATENANA MALAZA FAHAZAVA`,
  },
  {
    id: "10",
    title: "Ho anao",
    type: "lyrics",
    lyrics: `
      Ho anao zay mana-tsofina anio henoy! Henoy fa ho anao no hirako
      Ho anao mpanjeny andro lava, tsy mba mahatsiaro mivavaka io ê
      Variana dia variana, sondrina ka sondrina @ zava-dratsy
      Tena ao anaty loto migoka sy mifoka no sady manompo sampy
      
      Ka mba mieritrereta, zay hasoa anao
      Fa ny zava-drehetra, tena azo atao
      Nefa tsarovy tsara, ’lay voankazo voarara tena poizina ho anao
      Jereo ny lalan-kombana, mba saino izay hiafarana
      De fantaro avokoa ny ratsy sy ny soa, fidio zay ho anjaranao
     
      Vavy: Ô ry ondry izay nania, miverena modia
      Miantso anao ê ny Ray fa tiany ianao mba ho ateraka indray ê
      Fa ny fonao maloto, omeo ho diovin’ny Tompo
      Aza manao fanahy hiniana sao tratra ao aoriana ka hanenina ianao
      Fa Jesoa mampanatena fa anio dia omena anao ilay famonjena
     
      Lahy: Asakasakao izay tsy hamaly ny antsony
      f’izy anie ka miandry foana ny hiverenanao
      Miantso anao ê ny Ray fa tiany ianao mba ho ateraka indray ê
      Ianao tsy mety mino tsy Mankato
      Tsy mba mety hendry fa zaza mafy loha
      Aza manao fanahy hinina sao tratra ao aoriana ka hanenina ianao
      Fa Jesoa mampanatena fa anio dia omena anao ilay 
      
      RANTSANA FANATENANA MALAZA FAHAZAVANA
`,
  },
  {
    id: "11",
    title: "Ilay zanaky ny mazava",
    type: "lyrics",
    lyrics: `
        1. Tena mahonena loatre ny fiainanay ety
        Milaza ho mpivavaka kanefa be siasia
        Impiry impiry no nandalo tao an-tsofinay
        Izany toriteny izany fa tsy fantatray
        Heverinay ho toy ny zava-poana
        Misary adala mandany fotoana
        Maketsy makeroa mibalady
        Andramana avokoa ireo zava-pady
       
        Fa maro aminay e no mafy sofina
        Miady mifandrafy foana dia mifanosina
        Tsy mba tsapanay ilay fiadanana
        Ilay zanaky ny mazava tonga hanome anay fiainana
        
        2. Aza ataonao tafahoatra r'ilay ondry nania
        Tsy tsapanao ve fa tsy mety ity ataonao ity
        Nanetry tena anie ny Tompo hamonjy anao
        Na dia tanana maloto mbola raisiny ianao
        Ankehitriny tonga ny fotoana
        Ny tiana sy ny tia no tafahoana
        Misokatra ho anao ny vavahady
        Mahita famonjena izay mitady
        
        Izay ela izay dia mafy sofina
        Miady mifandrafy foana dia mifanosina
        Anio tsapanay ilay fiadanana
        Ilay zanaky mazava tonga hanome anay fiainana

        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "12",
    title: "Iraka",
    type: "lyrics",
    lyrics: `
        1.Iraka anio no miantefa @nao
        Fa misy tadio ao an-tanàna ao
        Feno loza mitatao fa nanao izay tsy fanao
        Na kely na lehibe, tsy mahita tsy mandre e!
        Ianao 'zao no antsoina, mba hijoro am-pinoana
        Hitady ny very, hanangana mamely
        Hitory famonjena, ho an'ity firenena
        Mitsangana mihazavà, Jesoa Tompo no mitahy fa .......

        Ref: Aza mandà 'lay antso toy ilay nataon'i Jona
        Ankibon'ny trondro vao tonga saina ralehilahy
        Nivalo nifona dia nanaiky ary koa nandeha
        Nitoriteny tao an-tanànan'i Ninive
        Rehefa voaantso dia araraotinao ny occasion
        Aza mangatak'andro fa manapaha decision
        I Jona atao leçon, i Jesoa atao devant
        Ekeo am-pifaliana dia tanteraho ny mission

        2.Ry namako o anio, mandehana lazao
        Ny lalana ahitsio, ny gadra vahao
        Tsy fotoana fatoriana f'aza ilaozana variana
        Andao andeha f'efa deconfiner e!
        Fa mpitarika mahery no momba sy mijery
        Koa aza manahy, herezo ny fanahy
        Hitety havoana, na voky na ho noana
        Mitsangàna mihazavaha, Jesoa Tompo no hitahy fa......

        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "13",
    title: "Ity fireneko",
    type: "lyrics",
    lyrics: `
        Andriamanitra ô! Miantso Anao aho
        Hoan’ity fireneko tena mitalaho
        Izay rehetra jerena toa mandreraka ny aina
        Aizim-pito lalandava takona ilay maraina
        
        Mila Anao hianteherako aho Jesoa malala ô
        Fa ny fiainana miharatsy fa tsy mba mihatsara
        Gidragidra isan’andro toa mampahonena
        Mitomany mitaraina fa mila famonjena

        Ref: Tompo ô vonjeo ny taninay
        Fa mila Anao sy manantena
        Miandrandra ilay famonjena
        Avy Aminao, avy Aminao
        Aza avela irery fa mba jereo
        Raha sitrakao atsangano fa lavo
        Ity fireneko
                
        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "14",
    title: "Ity foko ity",
    type: "playback",
    audio: require("@/assets/audio/playback/ity foko ity.mp3"),
    lyrics: `
        1.Ity zandrinao ity anie Jesoa, mora misendoatra maniasia
        Tsy mba mety tony fa toa miaka-dava tsy manam-pitia
        Tezitezi-poana isan’andro izao, tsisy endrika mirana ilay
        zandrinao
        Meteza hanamboatra ny foko, ho afaka hitoeranao
        
        Ref: Amboaro ny foko Jesosy ô, amboaro ho toy ny Anao ê
        Ny ratra sy ny toloko, avia mba fafao ê
        Anaro ny foko Jesosy ô, hanaiky ny sitrakao ê
        Diovy izay mety ho loto, midira hanjakao ê
      
        2.Izay mety ho alahelo anie Jesoa, soloy fifaliana ho taratrao
        Tsy hiondrika intsony fa efa Ianao no ao anatiko ao
        Ka na ahoana hiainana ety, ny foko mitony manana Anao
        Tsy ho taitra satria efa voatefinao
        
        Raha sendra ka voaloto Tompo ô, diovy ho vaovao
        Ity foko ity tandremako ho tena lapanao
        Tsy omeko Tompo hafa intsony ankotranao
        Indro Jesoa ô ny foko hanjakao

        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "15",
    title: "Iza no sahy?",
    type: "lyrics",
    lyrics: `
        Hiaraha-mahita e,izao fiainana izao fa be ny zava-mampahory
        K'izany indrindra e,no iantsoana anao hamoha ireo mbola matory
        Raha henonao izao iraka izao,manainga anao andeha hitory
        Handrava sy handrodana ny efa lao, kanefa hanorina sy hamboly

        Hizara ny teny soa, hampandreneso avokoa
        Izay rehetra hitanao mitady hamoy fo

        Ndehana vitao ny asanao mahatanjaha
        Efa nofidiko ianao ndeha ka miavaha
        Aza kivy miasà,mahereza mivavaha
        F'izao no homba anao ka aza manahy

        Izao tsarovy fa ny hizoranao,tsy maintsy misy fisedrana
        Fa tsy mitovy izay efa natao, ny hasaro-dalana hombana
        Hampody indray ireo nivily nania,ny voageja ho vahana
        Amerin'azy ao am-bala satria,ndrao ho rombahin'i satana

        Ka iza ary no sahy?hanaiky ianao sa handà?
        Fa izany anie no asa tena tsara

        Fa mila anao hitory sy hanambara
        Aza fihinina fa mba mizarà
        Ka ho vontosana filazantsara
        I Madagasikara

        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "16",
    title: "Jesoa tia anao",
    type: "playback",
    audio: require("@/assets/audio/playback/Jesoa tia anao.mp3"),
    lyrics: `
        1.Be fahorina ve @ fiainanao
        Maro mpanenjika @ izay atao
        Kanefa matoky fa Jesoa tsy mba mandao
        Izy no iady fa angina kosa ianao
        
        Ref: Jesoa tena tia anao, Izy hanoro lalana
        Tsy miala tsy mandao eo foana Izy
        Jesoa tena tia anao, Izy anolo-tanana
        Tsy miala tsy mandao eo foana Izy
        
        2.Tompo ô mba mihaino ka henoy vavakay
        Ka ny mombanay rehetra antananao
        Ka vonona hanoa, hanao izay rehetra sitrakao
        Ka ny mombanay rehetra an-tananao

        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "17",
    title: "Longoko",
    type: "playback",
    audio: require("@/assets/audio/playback/longoko.mp3"),
    lyrics: `
        1.Ino raha mahazo anô, no milofiky tahak’izô
        Nisedra ny mafy tsy laitra ê, Ka tsy mahita atô
        Nanano azy ho mavita tena, hay vao niandoha dia nianjera
        Tsy mba nandeha tam-pinoana, potraka mapahonena
        Anao mihevitry fa tsisy tia, very hevitry lany fanahy
        Fa misy lehilehy araiky ê, mbola miambina anô
        Ambaravaran’ ny fo, Izy miandry ampidirignô
        Andao sô anao taraiky ê, niainy ty tapaho ny hevitrao FA
        
        Ref: Havako ô! Harararaoty arô
        Dieny mbola mitsotra ny tanany, handray mba ho zanany
        Jesosy arô, tsy manary anô
        Longoko ô! Mipodiagna anô
        Fa izy tsy manavakavaka, te hanarinanao ao an-davaka
        Jesosy arô, tena tia anô
       
        2.Efa lôso ny zaka taloha, indro voavaotra avokoa
        Zay lalana tena nafaitra ê, efa niova ho soa
        Nanefy fa tsy nampianjera, nanananao fandresena
        Jesosy zoky jerena, fa Izy arô famonjena
        Avy anao manaraha, ovay ny fo mibebaha
        Fa misy fiainana raitra, efa nomaniny ho anô
        Ambarambarako anô, lay paradisa vaovao
        Andô sô anao taraiky ê, niany ty tapaho decision FA

        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "18",
    title: "Mahasambatra ahy",
    type: "lyrics",
    lyrics: `
        Mahasambatra ahy ny anilanao Ray,
        mahasambatra ahy ê
        Fa mampifalifaly fo mahafaly fanahy
        Mahavelombelona aina sy mampitony saina
        Tena sambatra aho, foana ny taraina

        Faly ê faly izany foko
        Tena sambatra aho foana ny toloko
        Ravo ravo koa ny saina
        Tena sambatra aho foana ny taraina

        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "19",
    title: "Malalany",
    type: "playback",
    audio: require("@/assets/audio/playback/malalany.mp3"),
    lyrics: `
        1.Mandalo sedra-piainana ny fiainantsika ety
        Maro tohatohatra ka sarotra ny dia
        Fahoriana, fijaliana, alaelo lava izao
        Antsoy ny anarany fa Izy anampy anao

        2.Raha sendra fahalainana ka mihembotra aho satria
        Tsy misy hitarainana fa miady irery ety
        Fanakivina, fanaratsiana , mampilofika anao
        Antsoy ny anarany fa Izy anampy anao
        
        Ref: Mahereza mivavaha henoiny foana ny zanany
        Aza kivy mitrakà, adidiny fa asan’ny tanany
        Izay rehetra ataonao ataovy @ anarany
        Fa tena tiany ianao malalany

        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "20",
    title: "Mandehana",
    type: "lyrics",
    lyrics: `
        1.Mandehana @ herinao ê
        Miorena tsara aza miovà
        Ka raiso ny adidinao ê
        Tsarovy fa Jesoa no lova

        Ref: Mandehàna, mitorià
        Ambarao Jesoa Kristy
        Mijoroa ka sahià
        Hanambara ilay fitiavany
        Mazotoa fa aza malaina
        Izay efa azonao ihany zaraina
        Ho mpanarato vonona sy sahy
        Harotsay ny haratonao harotsahy

        2.Mivoaha ary misehoa
        Izay no baikon’ny Tompontsika
        Ny asanao efaho avokoa
        Dia handova paradisa

        Ô! Vontosy filazan-tsara
        Ity nosy Madagasikara

        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "21",
    title: "Miarahaba",
    type: "lyrics",
    lyrics: `
        Fa ny fonay ravoravo
        No manandratra ny avo
        Fifaliana lalandava
        Faly mifanatri-tava

        Fa ny fontsika mifankatia
        No mampifandray satria
        Iray isika ê, samy zanany
        Miarahaba anao @ anarany

        Arabaina manontolo
        Na tanora na fotsy volo
        Rantsana fanatenana
        Ny manano mbola tsara

        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "22",
    title: "Mpandresy",
    type: "lyrics",
    lyrics: `
        1.Mpandresy aho eny ê! Mpandresy aho ê!
        Mahery aho eny ê! Mafery aho ê!
        Mpandresy miaraka @ Jesoa mpandresy
        Mahery aho miaraka @ Jesoa mahery
        
        Ref: Falifaly lalandava, miramirana ny tava
        Eo anilanao, eo anilanao milamina tsy misy kotaba
        Ravoravo re ny foko, mitsiky tsy misy toloko
        Eo anilanao, eo ailanao ooo! Tsara e!
       
        Zoky ê! Zandry a!
        Mahery aho miaraka @ Jesoa mahery
        Zoky ê! Zandry a!
        Mandresy aho miaraka @ Jesoa mandresy
        
        2.Mijoro aho Tompo ô, mijoro aho ê
        Handroso aho hanompo ô, handroso aho ê
        ‘zay rendrarendra efa nafoiko daholo
        Omeko Anao ny amiko manontolo

        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "23",
    title: "Niova fo",
    type: "lyrics",
    lyrics: `
        1.Nirenireny aho tsy nitsinjo ny any aoriana
        Tsy nahatsiaro ilay fitiavanao
        Tena nilomano tanaty faharatsiana
        Anio aho Tompo ô mifona eto Aminao
        
        Ref: Efa niova fo ka raiso aho ry Tompo
        Atolotro Anao ka anjakao ny foko
        Ny tanako raiso fa aza avela ipitrapitra
        Hiverina Aminao ity zaza efa naditra
        
        2.Be ireo adalako fa nodianao tsy hita
        Tsy mendrika akory aho nefa navotanao
        Notoloranao ahy ny fitiavanao tsy ritra
        Anio aho Tompo ô hiverina Aminao
        
        3.Ry Jesoa malala ô tsy ataoko manin-droa
        Tsy hihemotra intsony aho fa manana Anao
        Ireo toetra ratsy efa nafoiko avokoa
        Anio aho Tompo ô hanara-dia Anao

        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "24",
    title: "Ny hatsaranao",
    type: "lyrics",
    lyrics: `
        Amin’ny andro-piainako rehetra Ianao no antsoiko
        Na zava-mamy na mangidy ny ho sotroiko
        Maharesy lahatra ahy ny anaranao
        Mahavonjy ahy ny miantso ny anaranao
        Hasehonao miharihary ny fitiavanao
        
        Na anaty ady manahirana ê! Tsy nafoinao
        Na faly aho na koa sahirana ê! Eo foana Ianao
        Mihazona ahy tsy ho lavo an-dalana ( Ou! Ou! )
        Manohana ahy hiaka-piakarana ( Ou! Ou! Ou! )
        Tsapako isan’andro izao ny fahalehibiazanao
       
        Raha asaina misafidy any aho
        Dia aleoko miaraka Aminao
        Hafa mihintsy anie Jesoa ilay
        eo akaikinao
        Ka n’inon’inona atao, ekeko ny fitondranao
        Tsy misy harombaka ny foko f’efa babonao
        Mba raiso aho ho zandrinao
        Ka ny lalanao no lalako

        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "25",
    title: "Ny lalako",
    type: "playback",
    audio: require("@/assets/audio/playback/Ny lalako.mp3"),
    lyrics: `
        1. Ny lala-nodiaviko hatrizay Tompo dia efa voasoritrao
        Indraindray toa mampikolahy kanefa miroso na sarotra atao
        Efa nataonao holalovako na dia fiakarana mideza jerena
        An-tampo-kavoana Tompo no nomaninao ho ahy ilay fandresena
        
        Hitraka aho ho sahy fa misy tana-mihazona hirosoako
        Tsy hanana ahiahy fa nataonao io hanefy ny finoako
        Misy maso mijery mitsinjo mampijoro toy izao
        Tsy amela ahy ho irery ilay manomana lalana vao
       
        2. Ny lalanao Izay feno harambato e tsarovy fa misy dikany io
        Raha sendra tojo ankaso e mandalo ihany f'izao tadidio
        Valim-piakarana anie ka mijotso e tandrifin-drahona tsy aharitr'ela
        Mamikira tsara @Tompo e dia tsy mora mianjera
        
        Ka dia mitrakà fa misy tanana mihazona anao
        De aza manahy fa Izy itantana ny alehanao
        Efa hitany sy reny, ireo toloko sy tarainanao
        Izy efa niteny fa adidiny ianao
        
        3. Izay sarotra efa hita taloha dia sori-dalana avy Aminao
        Tsy misy atahorako,arahako foana ilay dia-tongotrao
        Ny hany ataoko ho rehareha,tsy misy afatsy ny Anaranao
        Na anaty ady sarotra dia Ianao manomana lalam-baovao
        
        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "26",
    title: "Ovao ny famindranao",
    type: "playback",
    audio: require("@/assets/audio/playback/ovay ny famindranao.mp3"),
    lyrics: `
        Vavy: Misy hafatra kely mba tiko ambara ho anao ity ranadahy
        Miha-tanora sy miha-lehibe ianao dia tia andrakandrana sahisahy
        Heverinao tsy mahita moa io ataonao io
        Andriamanitra ao atampo-doha mijery anao fa tadidio
        
        Ianao faly mipololotra, milaza fa sambatra
        Dia tsy menatra ery mizotra @ lalana mankany an-davaka
        Tsy mahavoky anao raha noana ny zava-mahadomelina
        Aza mihinakina-poana ndrao de mbola hanenina
        
        Tempolin’ny Tompo anie, zokin’ny tenanao
        Aza simbaina namako, hatsaharo ilay ditranao
        Faingana ianao modia ny Tompo miandry efa ela be
        Sao tara sanatria ka ho voahendy any @ afobe
        
        Zany no hafatro ranadahy, tiako ianao mba hiova fo
        Tsisy tokony hampanahy, raha vonona ianao ka hitodi-doha
        Fa n’aiza n’aiza aleha, Jesosy tsy manary
        Izy efa vonona hanome fiainana tsara sy lavorary
        
        Ovay ny famindranao ê
        Aza manao ny tsy fanao
        Ovay ny famindranao ê
        Ovay zao de zao

        Lahy: Tonga saina aho ka hiteny, henoy kely aho ranabavy
        Efa tsy menatra intsony ianao manao fitafy mamoa-fady
        Toetranao mitsiriritra, ny fijery ahitsio
        Mba mahaiza mipitrapitra, fa aza dia zatra mitery kiho
        
        Ianao mifosa lava, manaratsy ny namanao
        Kristianina sadasada, mpivavaka nefa mpamely tsaho
        Mba mahaiza mitondra-tena, ovay ny famindranao
        Tena mapahonena f’aza manao ny tsy fanao
        
        Rehefa mba mandeha fehezo ny tenanao
        Dia tsarovy foana hoe Jesosy eo anilanao
        Ho toy ny reny tantely mitondra mamy bedebe
        Ho filamatra sy modely dia tsy ho kitozan’ny afobe
        
        Zany no hafatro ranabavy, tiako ianao mba hiova fo
        Aza manahy ny ho avy, ombanao anie Jesoa
        Fa n’aiza n’aiza aleha, Jesosy tsy manary
        Izy efa vonona hanome fiainana tsara sy lavorary
        
        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "27",
    title: "RATSY NY TOAKA",
    type: "lyrics",
    // audio: require("@/assets/audio/tsarapetrapetra-playback.mp3"),
    lyrics: `
        1.Efa voalaza ombieny ombieny hoe mitrandrema re ry vahoaka
        Mitandrema fa any aoriana any lozan'ireo izay migaka toaka
        Fa mbola maro ireo mafy loha ambarako eto ka mba jereo
        Aza miandry hoe efa voa vao mibabababa miantso vonjeo
        Jesosy Tompo efa niteny fa ny mpimamo tsy mba mandova
        Ireny zava-bitanao ireny mety hiteraka zava-doza
        Ny eto an-tany anie ka mandalo izay no tsarovy sy tadidio
        Mbola tsy tara ianao raha hivalo ka miova anio dieny anio

        Ref: Avelao tena aoka
        Ialao moa nama fa ratsy ny toaka
        Io fiainana io tsy ety dia vita
        Mba katsaho ny paradisa

        2.Diniho kely anie rehefa mamo mitabataba sady tia ady
        Manakorotana ny ao an-trano mamono zaza mamono vady
        Tsy misy fiaina-tsambatra intsony ratsy ny vokatr'io toaka io
        Ambadik'io anie ny devoly miangavy anao izahay mba fadio
        Raha azo atao aza miandry ela raiso Jesosy hanafaka anao
        Antsitra-po nefa tsy terena fa izy hamela ny helokao
        Raha tianao ny ho tsara fiafara hanana fiainana vaovao
        Jesosy vahaolana tsara vonona hamaha ny fatoranao

        3.Hafatra apetrakay aminao ampy ny andro tsy nahalalana
        Ka mba ovay ny fomba fanao tena ampy izay ny adalana
        Aza miankin-doha amin'ny ratsy manimba tena, fo sy fanahy
        Zavatra mankarary ny aty no heverinao fa hasambatra
        Atoroko anao ny lalana tsara mba handovanao ny lanitra
        Jesosy ihany no tiako ambara ilay zanak'Andriamanitra
        Fahamarinana sy fiainana hampiadana ny vahoaka
        Koa ho anao izay zatra nihinana aok'izay fa ratsy ny toaka
        
        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "28",
    title: "Ray zanaka fanahy",
    type: "lyrics",
    // audio: require("@/assets/audio/tsarapetrapetra-playback.mp3"),
    lyrics: `
        1.Ny anaranao Ray mpahary no antsoiko
        Ny fitantananao no andreseko ireo toloko
        Tazomy mafy fa malemy tsy mahatana Anao
        Mora voagafy somparan'izao tontolo izao
          Fa mandia tany malama ka manao adalana
          Anaro fa zanaka
          Na zaza be siasia aza arianao sanatria
          Ampodio ambalanao
       
        2.Anilanao no mampitony Jesoa Zoky
        Tsy mba taitaitra intsony, manana Anao manome toky
        Ny raho-mainty aza misava, feno tsiky tontolo
        Ny alahelo efa rava fa eo Ianao mikolokolo
          Raha tojo zavatra niriana ka feno fifaliana
          Ampianaro ahay hisaotra Anao
          Toloranao fahendrena hazoto hanetri-tena
          Ho zandry mpanoha Anao
       
        3.Meteza hatrany ho mpanazava Ianao fanahy
        Fanahy masina mpanolo-tsaina mahay
        Ny afonao no aoka hameno n'aiza n'aiza aleha
        N'inona atao Ianao no ataoko rehareha
          Raha sedra fakam-panahy, ankaso antsonjay
          Hijoro tsy ahiahy
          Tsy hiemotra izany na ho faly na tomany
          Herezonao fanahy
        
        Ilay telo izay iray, ray zanaka fanahy
        No efa nomba anay na misy ady mahamay
        Na fitsapana nifanesy, ireo no nentiny nanefy
        Oooooo, nampivoaka ahy ho mpandresy
        
        RANTSANA FANATENANA MALAZA FAHAZAVANA
    `,
  },
  {
    id: "29",
    title: "Vontosy",
    type: "lyrics",
    // audio: require("@/assets/audio/tsarapetrapetra-playback.mp3"),
    lyrics: `
      1. Mandehàna ry fanantenana
      Hamiratra hitondra fahazavana
      Hamonto hamonto filazantsara
      Inty Nosy dia i Madagasikara ô ô ô
      Ambarao ary fa aza mitarejetra
      Ho ren’ny olombelona rehetra
      Fa mitory, hitory ny famonjena
      Ho an’ireo vahoaka sesehena ô ô ô
      Koa vonony ny fo, fanahy ny tena
      Andeha hanavao ity firenena
      Hiarina, hiova mba hiatsara
      Rehefa vonton’ny filazantsara

      Ref: Vontosy filazantsara; ny Nosy Madagasikara
      Ry Rantsana Fanantenana
      Malaza Fahazavana ô

      2. Tsy menatra hanambara, vonona hizara
      Hamonto filazantsara ny Nosy Madagasikara
      Izay no baikon’ny Tompo, handeha ary ry mpanompo
      Ô ry lahy e! ô re roy e! ô lehiretsy a! Andao e!
      Hanarina hy lavo fa atomotra ny andro
      Ireo mifatotra vahana, areheto ny hazavana
      Izay miparitaka angony, dia fohazo izay matory
      Jesosy efa ho avy, hanavaka izay tsy Azy
      Ry mpivahiny ô mba saino kely anie
      Fa ny ora sy fotoana tsy fantatrao re!

      RANTSANA FANATENANA MALAZA FAHAZAVANA`
  },
  {
    id: "30",
    title: "Safidiko",
    type: "playback",
    audio: require("@/assets/audio/playback/Safidiko.mp3"),
    lyrics: `
      1.Safidiko Tompo ô ny ho Anao
      Ho fitaovana eo am-pela-tananao
      Efa nekeko avokoa anie ry Raiko
      Ny asa izay nomenao ka ho efaiko
      
      Na sarotra ny lalana, tsy ataoko ampihemotra ahy
      Na enjika na fanesona tsy ho kivy ny fanahy
      Efa fantatro f’Ianao Jesoa mitantana anay ê
      Izaho matoky Anao mandrakizay
      
      2.Safidiko na oviana na oviana
      Hiaraka Aminao hilanja ny hazo fijaliana
      Manolo-tena ho Anao irery
      An-tsitra-po fa tsy misy an-tery
      
      Ny ady hatrehanao anay tsy mora tsy ataoko hampihemotra ahy
      Na oram-baratra midona tsy ho kivy ny fanahy
      Efa fantatro f’Ianao Jesoa mitantana ahy
      Izaho matoky Anao mandrakizay
      
      Na! na! na! na! na! na! na! na! na! (X2)
      Efa fantatro f’Ianao Jesoa Ianao mitantana ahy ê
      Safidiko ny ho Anao ry Ray

      RANTSANA FANATENANA MALAZA FAHAZAVANA`
  },
  {
    id: "31",
    title: "Sens unique",
    type: "lyrics",
    // audio: require("@/assets/audio/tsarapetrapetra-playback.mp3"),
    lyrics: `
      Etsy kely ry ngahy mpamily ô, atoroko anao
      Misy sampanana mizara 2 ao aloha ao
      Ny iray malalaka, ny iray tery
      Ka raha diso izay alehanao dia mety ho very
      ka hony hoa fantatrao ve izay aleha?
      Moa ve feno tsara ny papier ?
      Moramora ihany fa aza maika be
      Fidio tsara ny lalanao paradisa sa afobe
      
      Fa sens unique e! Ny lalantsika io nama
      Tsy afaka hiverenana io fa aza mihanahana
      Omeo an'i Jesoa 'lay lakile Izy atao sôfera
      Rah te ho tody any amin’ny arrivée aleo manetri-tena
      Ny familiana ê! Io tsy vazivazy
      Raha mpitondra tsy mahay mivarina any an-kady
      Vao manainga de calé efa tara mbola very
      Rehefa any @ afobe any tsy afaka miteny
      Dieny izao kay ê! Mbola afaka miova
      Koay e! Aza miandry loza
      Izao ô izao no fotoana
      Ndeha tapaho ny hevitrao ka ahoana?
      
      Izao e! Izao ilay tantara!
      Ambarako @nao fa io tsy misy lainga ka henoy tsara
      Ny lalana izorana tsy misy anaki-telo,
      na any amparadisa enao na any @ helo
      Ka fidio a izay misy anao anio a
     
      Ambarao ho ren'ireo tsy mahalala
      Taomy hiverina hivavaka ry zefa, ry bodo sy ry fara
      Aok'izay ny fialonana diovy ny fo,
      ny ady sy fosafosa avelao avokoa
      Mihavàna (hoa) handova ilay kanàna
      
      Aza menatra ny ho vavolombelon’ny Tompotsika
      Atomboy eto Jerosalema ka hatrany am-pita
      Tantarao ho ren’ny rehetra fa tsy tsara
      Ny misotro toaka, mihina-paraky, mifoka sigara
      
      Izay lalan-dratsy nahazatra teo aloha,
      andeha re ovaina fa tsy mahasoa
      Raha ny zanaka no hahafaka anareo a
      Dia ho afaka tokoa ianareo a

      RANTSANA FANATENANA MALAZA FAHAZAVANA`
  },
  {
    id: "32",
    title: "Tafatoetra",
    type: "lyrics",
    // audio: require("@/assets/audio/tsarapetrapetra-playback.mp3"),
    lyrics: `
      1. Tafatoetra aho Tompo ka mahatoky fa voatefy
      ara-panahy
      Mitoetra manana Anao zoky mpiaro sy mpitahy
      Tafatoetra aho ka tsy hiala intsony hifikitra Aminao
      Ianao no ataoko ambonin'izao rehetra izao
     
      Ref: Tafatoetra aho Tompo ô, tanteraka
      Na hihazakazaka aho dia tsy ho reraka
      Handroso hery any aho, elatra no iakarako
      Fa efa tafatoetra ny amiko
     
      2. Lalan-diso efa nahintsinao voahova saina fo
      Toetra efa vaovao no indro iainako
      Tsisy mampanahy fa tena tony ny eo akaikinao
      Fa tena miadana ny fon'ny mitoetra eo Aminao
      
      Voazaha toetra e, ka tsy asiko fetra e
      Ny amiko rehetra e, no efa tafatoetra e
      Efa niova fo e, hafa ny taloha e
      Ka tafatoetra ny amiko

      RANTSANA FANATENANA MALAZA FAHAZAVANA`
  },
  {
    id: "33",
    title: "Tanora velona",
    type: "playback",
    audio: require("@/assets/audio/playback/Tanora fanantenana.mp3"),
    lyrics: `
      Tanora velon’ny finoana
      Mijoro hatrany fa tsy mirona
      Vonon-kisedra @ izay midona
      Raha mbola hoe asa fanompoana
      Manaiky @ fonay sy ny vava
      Zay mety alaelo efa nisava
      Fa Jesosy Tompo no eo aloha
      mitarika anay hoe mandrosoa
      
      Ô tongasoa ê! Ao an-kanana
      izahay rantsana fanatenana
      Hiroso hatrany ê! Tsy hisalasala
      Ho malaza tena fahazavana
      
      Miara-maty @ Jesoa
      Miara-miaritra @ Jesoa
      Miara-mandeha @ Jesoa
      Zahay manaiky an’I Jesoa

      RANTSANA FANATENANA MALAZA FAHAZAVANA`
  },
  {
    id: "34",
    title: "Tokiko",
    audio: require("@/assets/audio/playback/Tokiko.mp3"),
    lyrics: `
      1.Na mafy mahamay ny adinay ety
      Feno fakam-panahy maminganana ny dia
      Ireo fisedrana mifanesisesy f’hijoro aho
      Matoky hatrany aho f'Ianao tsy mba mandao
      
      Na ranomasina na miaramila
      Hanefy avy ao aloha sy avy ao aoriana
      Jehovah Ray no tokiko, raketiko ao am-po
      Ilay miteny anay hoe mandrosoa
      
      2.Tsy ho fahafatesana ny anton'izao
      Fa tianao ny haneo ny voninahitrao
      Tsy foinao ny ho very aho, f'akaikinao
      Matoky hatrany aho, f'Ianao tsy mba mandao
     
      Anarinao satria zanaka tiana
      Avotanao raha sendra fahoriana
      Hatr@ izay dia tokiko raketiko am-po
      'lay fitiavanao tsy niala tamiko
      Jesosy Ianao no tokiko

      RANTSANA FANATENANA MALAZA FAHAZAVANA`
  },
  {
    id: "35",
    title: "Tsy any ny lalana",
    audio: require("@/assets/audio/playback/Tsy any ny lalana.mp3"),
    lyrics: `
      EEEHHH!!! Zay tsy ho any a
      Zay tsy ho any fa mahavery ny lalana mankany a
      KAAA miantso anao ‘zay, hiala tany dia andao hanaraka anay
      
      Raha izany toaka izany aloha zahay tsy isotro
      Zava-mahadomelina manimba sy mandoto
      Tsy hisalasalana fa tonga de ialana
      Zay tsy hisotro an’io fa rara-kivin’ilay satana
      
      Raha hoe izay sigara zahay tsy hifoka
      Na io goloase na melia mena na goodluck â
      Toa setroka hafahafa, mahavoa ny cancer
      ‘Zahay tsy hifoka an’io fa ny vatako mantsy tsy fatapera
      
      Raha io parakinao io e, ‘zahay tsy mila
      Fa ny olona mihinana rehefa miteny mivaralila
      Mandrora isa-minitra tsisy fiainana mendrika
      ‘Zahay tsy mila an’io fa ny vavako tsy fitaomana zezika
      
      RY NAMAKOO!! Tsy any lalana
      Miverena sao very any avy atolory ny tanana
      Fa ny lalana tena tsara, vahaolana no omeko anao
      Jesosy no tiko ambara vonon-kanova ny fiainanao
      
      EEEH!! Tapaho hoa ny hevitrao
      Avy manantona fa rantsana fanatenana no miantso anao
      Zay efa hanainga mintsy efa maika ho tonga any @ arrivé
      Zay tsy miandry ny tsy afaka, zay taraiky any désolé

      RANTSANA FANATENANA MALAZA FAHAZAVANA`
  },
  {
    id: "36",
    title: "Tsy maintsy tafa",
    type: "lyrics",
    // audio: require("@/assets/audio/tsarapetrapetra-playback.mp3"),
    lyrics: `
      Be ireo miherikerika etsy sy eroa mitady anarana hafa
      Tsy fantany hoe tsy misy ankiroa fa tokana ny mpanjaka
      Tsy misy ahazoana famonjena hafa-tsy ao Aminy ihany e
      Izy no efa nampanantena, vitainy izay nolazainy a

      Fa tsy mba mamitaka Izy tsy mba mandainga
      Rehefa fotoana avy hatrany dia miainga
      Izy tsy mizaha tavan'olo fa tiany daholo

      Izay miantso Azy dia valiany, henoiny
      Tsy misy hatahorana intsony
      Azo itokisana @ tsiambaran-telo,
      Mampisava alahelo

      Ny mialoka Aminy ihany no tsara fialofana ê,
      misy mitantana rehefa mandeha
      Tsy resy an'ady tsy mba mora torovana ê,
      fa manana Andriamanitra lehibe
      Raha sendra miondrika misy mampitraka,
      ny ranomaso misy mpamafa
      Fa ny eo ankaikinao ihany Tompo ô,no TSY MAINTSY TAFA

      Misy fantarina izay mahasoa amikirana tsara
      Ny lalan-dratsy izay nahavoa avy hatrany ialana
      Ny sori-dalan'izay nomeny io arahina hatrany ê
      Fa Izy izay rehefa miteny tsisy hatohitra izany

      RANTSANA FANATENANA MALAZA FAHAZAVANA`
  },
  {
    id: "37",
    title: "Tsy miova",
    type: "lyrics",
    // audio: require("@/assets/audio/tsarapetrapetra-playback.mp3"),
    lyrics: `
      Tsy miova
      Ahirato izao ny masinao ka mijere
      Izany dradradradra izany moa tsy renao ve?
      Ny fiainana eto miharatsy efa mila tsy ho tanty
      Mampiori-koditra ny aretina fa be ny maty

      Azominao ny tsara sainonao anio
      Akaiky anie ny farany f'izao no tadidio
      Mifikira ianareo ka n'inon'inona miseo
      Dia izao: Jesosy ihany no jereo

      Ilay niteny hoe:
      "Zanako aza mikoropaka mitonia
      Izaho no andamina ny lalanao fa matokia
      Na andeha amaky ny afo na hisy loza na ankaso
      Izaho no hamafa ny ranomaso"
      ô ô ô
      Fa Izaho no tsy miova hoy ny Ray
      Tsy miova aho omaly anio mandrakizay

      RANTSANA FANATENANA MALAZA FAHAZAVANA`
  },
  {
    id: "38",
    title: "Veloma",
    type: "lyrics",
    // audio: require("@/assets/audio/tsarapetrapetra-playback.mp3"),
    lyrics: `
      1. Havako ô tapitra eto ny fotoana
      Izahay no manao mandara-pihaona
      Raha miala eto ianao dia izao tsarovy foana
      Jesoa Tompo no ataovy eo anoloana
      Izy Ray ê! No hitantana ny dia
      Fa ianao aza kivy matokia
      N’aiza n’aiza ê! Na inona atao
      Andriamanitra homba ahy sy ianao

      Ref: Veloma ê! Veloma a!
      Havako ô ny fotoana manam-petra
      Veloma ê! Veloma a!
      Ho tahiana ianao na mandeha na mitoetra
      Veloma ê! Veloma a!
      Ny fiadanan’ny tompo @tsika rehetra
      Veloma ê! Veloma a!
      Handova ny fiainana izay no tarigetra

      2. Havako ô tsotra ny hafatro @nao
      Mandalo anie izao fiainana eto izao
      Ialao ireo ratsy izay fanao
      Mivavaha fa ny Tompo hanampy anao
      Izy Ray ê! No hitantana ny dia
      Fa ianao aza kivy matokia
      N’aiza n’aiza ê! Na inona atao
      Andriamanitra homba ahy sy ianao

      RANTSANA FANATENANA MALAZA FAHAZAVANA`
  },
];