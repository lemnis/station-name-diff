import diacritics from "diacritics";

// Transform german characters
Object.assign(diacritics.diacriticsMap, {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss",
  Ä: "Ae",
  Ö: "Oe",
  Ü: "Ue",
  å: "aa",
  Å: "Aa",
  ø: "oe",
  Ø: "Oe",
});

export const convertCyrillicToLatin = function(string) {
  var cyrillic = 'А_Б_В_Г_Д_Ђ_Е_Ё_Ж_З_И_Й_Ј_К_Л_Љ_М_Н_Њ_О_П_Р_С_Т_Ћ_У_Ф_Х_Ц_Ч_Џ_Ш_Щ_Ъ_Ы_Ь_Э_Ю_Я_а_б_в_г_д_ђ_е_ё_ж_з_и_й_ј_к_л_љ_м_н_њ_о_п_р_с_т_ћ_у_ф_х_ц_ч_џ_ш_щ_ъ_ы_ь_э_ю_я'.split('_')
  var latin = 'A_B_V_G_D_Đ_E_Ë_Ž_Z_I_J_J_K_L_Lj_M_N_Nj_O_P_R_S_T_Ć_U_F_H_C_Č_Dž_Š_Ŝ_ʺ_Y_ʹ_È_Û_Â_a_b_v_g_d_đ_e_ë_ž_z_i_j_j_k_l_lj_m_n_nj_o_p_r_s_t_ć_u_f_h_c_č_dž_š_ŝ_ʺ_y_ʹ_è_û_â'.split('_')

  return string.split('').map(function(char) {
    var index = cyrillic.indexOf(char)
    if (!~index)
      return char
    return latin[index]
  }).join('')
}

const latinPattern = /\p{Script=Latin}/u;
const cyrillicPattenr = /\p{Script=Cyrillic}/u;

/** @param {string} name */
export const containsLatin = (name) => latinPattern.test(name);

/** @param {string} name */
export const containsCyrillic = (name) => cyrillicPattenr.test(name);

export { diacritics };