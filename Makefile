PROJECTS_DIR := projects

PROJECTS := $(wildcard $(PROJECTS_DIR)/*)

.PHONY: all $(PROJECTS)

all: $(PROJECTS)

$(PROJECTS):
	cd $@ && yarn install && yarn build

%:
	cd $(PROJECTS_DIR)/$@ && yarn install && yarn build