from rest_framework.serializers import ModelSerializer

class FieldExcludableModelSerializer(ModelSerializer):
    def __init__(self, *args, **kwargs):
        exclude = kwargs.pop('exclude', None)
        super(FieldExcludableModelSerializer, self).__init__(*args, **kwargs)
        if exclude:
            excluded = set(exclude)
            for field_name in excluded:
                try:
                    self.fields.pop(field_name)
                except KeyError:
                    pass
