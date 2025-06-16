# 1. TensorFlow 임포트 및 버전 확인
import tensorflow as tf
print("TensorFlow 버전:", tf.__version__)
# 2. 기본 상수 생성 테스트
a = tf.constant(10)
b = tf.constant(20)
print("상수 a:", a)
print("상수 b:", b)
# 3. 기본 연산 테스트
c = tf.add(a, b)
print("a + b =", c.numpy())
# 4. 텐서 생성 테스트
tensor = tf.constant([[1, 2], [3, 4]])
print("2D 텐서:")
print(tensor.numpy())
# 5. GPU 사용 가능 여부 확인
print("GPU 사용 가능:", tf.config.list_physical_devices('GPU'))
print("GPU 개수:", len(tf.config.list_physical_devices('GPU')))