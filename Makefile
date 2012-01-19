# Umbrella Makefile.

include Makefile.common

##################################################
# targets

.PHONY : all doc debug syntax plus dijit

all :
	@$(call defer,Makefile.lib)

doc :
	@$(call defer,Makefile.lib)

debug :
	@$(call defer,Makefile.lib)

syntax :
	@$(call defer,Makefile.lib)

plus :
	@$(call defer,Makefile.lib)

dijit :
	@$(MAKE) -f Makefile.dijit

##################################################
# cleaning

.PHONY : clean clean-obj clean-exe clean-doc

clean : clean-obj clean-exe clean-doc

clean-obj :
	@$(call defer,Makefile.lib)
	@$(call defer,Makefile.dijit)

clean-exe :
	@$(call defer,Makefile.lib)
	@$(call defer,Makefile.dijit)

clean-doc :
	@$(call defer,Makefile.lib)

