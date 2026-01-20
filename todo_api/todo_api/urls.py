from rest_framework import routers
from todo_app.views import TodoItemViewSet

router = routers.DefaultRouter()
router.register(r'tarefas', TodoItemViewSet)

urlpatterns = router.urls