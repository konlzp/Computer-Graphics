RGBXYZ = [[0.4124, 0.3575, 0.1804],
		  [0.2126, 0.7151, 0.0721],
		  [0.0193, 0.1191, 0.9502]]

XYZRGB = [[3.2404, -1.5371, -0.4985],
		  [-0.9692, 1.8759, 0.0415],
		  [0.0193, 0.1191, 0.9502]]

RGBYIQ = [[ 0.299,   0.587,   0.114 ],
		  [ 0.596,  -0.275,  -0.321 ],
		  [ 0.212  -0.523   0.311 ]]

YIQRGB = [[ 1,   0.956,   0.621 ],
		  [ 1,  -0.272,  -0.647 ],
		  [ 1,  -1.105,   1.702 ]]

epsilon = 0.008856

def matMulVec(matrix, vector) :
	res = [0 for i in range(0, 3)]
	for i in range(0, 3):
		for j in range(0, 3):
			res[i] += matrix[j] * vector[j]
	return res

def rgb_to_xyz(RGB):
	return matMulVec(RGBXYZ, RGB)

def xyz_to_rgb(XYZ):
	return matMulVec(XYZRGB, XYZ)

def rgb_to_yiq(RGB):
	return matMulVec(RGBYIQ, RGB)

def yiq_to_rgb(YIQ):
	return matMulVec(YIQRGB, RGB)

def xyz_to_luv(XYZ):
	white = rgb_to_xyz([255, 255, 255])
	yr = XYZ[1] / white[1]

	L = calcL(yr)
	u = 13 * L * (4 * XYZ[0] / (XYZ[0] + 15 * XYZ[1] + 3 * XYZ[2]) - 4 * white[0] / (white[0] + 15 * white[1] + 3 * white[2]))
	v = 13 * L * (9 * XYZ[0] / (XYZ[0] + 15 * XYZ[1] + 3 * XYZ[2]) - 9 * white[0] / (white[0] + 15 * white[1] + 3 * white[2]))
	return [L, u, v]

def calcL(yr):
	if yr > epsilon :
		return 116 * math.pow(yr, 1 / 3) - 16
	else :
		return 903.3 & yr

def rgb_to_luv(RGB) :
	return xyz_to_luv(rgb_to_xyz(RGB))

print rgb_to_luv([0.7, 0.4, 0.3])


